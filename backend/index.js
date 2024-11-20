if (process.env.NODE_ENV != "production") {
  require("dotenv").config();
} // remove this after you've confirmed it is working

const express = require('express');
const app=express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
app.use(cors());
app.use(express.json());
const passport = require("passport");
const multer = require("multer");
const { storage } = require("./CloudConfig.js");
const upload = multer({ storage });
const User = require("./models/User.js");
const { hashSync, compareSync } = require("bcrypt");
require("./passport.js");
const jwt = require("jsonwebtoken");
const ExpressError = require("./utils/ExpressError.js");
const Patient = require("./models/Patient.js");
const Doctor = require("./models/Doctor.js");
const Appoinment = require("./models/Appoinment.js");

//connect database
const main = async () => {
  await mongoose.connect(process.env.MONGO_URL);
};
//for database
main()
  .then((res) => {
    console.log("success");
  })
  .catch((err) => {
    console.log(err);
  });

// if(cluster.isMaster){
//   console.log(`Master ${process.pid} is running`);
//   for(let i=0;i<numCPUs;i++){
//     cluster.fork();
//   }































//   cluster.on('exit',(worker,code,signal)=>{
//     console.log(`worker ${worker.process.pid} died`);
//   });
// }else{
//   console.log(`Worker ${process.pid} started`);
// }

//   const redis = require("redis");
// const redisClient = redis.createClient();

// redisClient.on("error", (err) => {
//   console.error("Redis error:", err);
// });

// redisClient.connect(); // Connect to Redis

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const redis = require("redis");
const redisAdapter = require("socket.io-redis");

const redisClient = redis.createClient();
const redisPublisher = redisClient.duplicate();



const numCPUs = require("os").cpus().length;
// console.log(numCPUs);
// if (cluster.isPrimary) {
//   console.log(`Primary ${process.pid} is running`);
//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }
//   cluster.on("exit", (worker, code, signal) => {
//     console.log(`worker ${worker.process.pid} died`);
//   });
// } else {
//   server.listen(3000, () => {
//     console.log("Server is listening on port 3000");
//   });
// }

// Handle Redis connection errors
redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

redisPublisher.on("error", (err) => {
  console.error("Redis Publisher Error", err);
});

// Configure socket.io to use Redis adapter
io.adapter(redisAdapter({ pubClient: redisClient, subClient: redisPublisher }));

const previousSlotKey = (user_id) => `previous-slot:${user_id}`;

// Save the previous slot in Redis
const savePreviousSlot = (user_id, doctor_id, date, time) => {
  console.log("PPPPPPPPPPPPPPPP");
  const slotData = JSON.stringify({ doctor_id, date, time });
  redisClient.set(previousSlotKey(user_id), slotData, "EX", 300); // Store for 5 minutes max
};

// Get the previously locked slot from Redis
const getPreviousSlot = async (user_id) => {
  console.log("ppppppppppppppppppppppppp");
  return new Promise((resolve, reject) => {
    redisClient.get(previousSlotKey(user_id), (err, reply) => {
      if (err) return reject(err);
      if (!reply) return resolve(null); // No previous slot
      resolve(JSON.parse(reply)); // Return previously locked slot
    });
  });
};

// Delete the previous slot when unlocked
const deletePreviousSlot = (user_id) => {
  console.log("ooooo");
  redisClient.del(previousSlotKey(user_id));
};

const lockSlotInRedis = async (doctor_id, date, time, user_id) => {
  const lockKey = `lock:${doctor_id}:${date}:${time}`;
  const lockDuration = 300; // Lock duration in seconds

  console.log("###########################33", lockKey);

  try {
    const doctor = await Doctor.findById(doctor_id);
    const availableSlots = doctor.availability.find(
      (d) => d.date.toISOString().split("T")[0] === date.slice(0, 10)
    );
    const slot = availableSlots.slots.find((slot) => slot.time === time);
    slot.status = "locked";
    slot.lockedBy = user_id;
    await doctor.save();
    console.log("MongoDB updated successfully");

    redisClient.set(
      lockKey,
      user_id,
      "NX",
      "EX",
      lockDuration,
      (err, reply) => {
        if (err) console.error("Redis SET Error:", err);
        console.log("Redis SET Reply:", reply);
        io.emit("slots-updated", { time, status: "locked" });
      }
    );
  } catch (err) {
    console.error("Error locking slot:", err);
  }
};

const unlockSlotInRedis = async (doctor_id, date, time) => {
  const lockKey = `lock:${doctor_id}:${date}:${time}`;
  console.log("@@@@@@@@@@@@@");
  try {
    const doctor = await Doctor.findById(doctor_id);
    const availableSlots = doctor.availability.find(
      (d) => d.date.toISOString().split("T")[0] === date.slice(0, 10)
    );
    const slot = availableSlots.slots.find((slot) => slot.time === time);

    if (slot.status === "booked") {
      console.log(`Slot ${time} is booked, so it will not be unlocked.`);
      return;
    }
    slot.status = "available";
    slot.lockedBy = null;
    await doctor.save();

    console.log("MongoDB updated successfully");

    redisClient.del(lockKey, (err, reply) => {
      if (err) console.error("Redis DEL Error:", err);
      console.log("Redis DEL Reply:", reply);
      io.emit("slots-updated", { time, status: "available" });
    });
  } catch (err) {
    console.error("Error unlocking slot:", err);
  }
};

const isSlotLockedInRedis = async (doctor_id, date, time) => {
  const lockKey = `lock:${doctor_id}:${date}:${time}`;
  console.log(lockKey);
  console.log("@@@@@@@@@@@#################");
  const ab = "";

  return new Promise((resolve, reject) => {
    redisClient.get(lockKey, (err, reply) => {
      if (err) {
        console.error("Redis GET Error:", err);
        return reject(err);
      }

      console.log(`Redis GET Reply for key ${lockKey}: ${reply}`);
      resolve(reply); // This should return the user_id if the slot is locked
    });
  });
};

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("get-available-slots", async (data) => {
    const { doctor_id, date, user_id } = data; //here destructuring is required to get the doctor_id and date becaue we are sending the data in the form of object AND GENERATING CASTERROR
    console.log(data);
    const date1 = date.slice(0, 10);
    try {
      const doctor = await Doctor.findById(doctor_id);
      if (!doctor) return;

      const allSlots = generateTimeSlots(date1);

      const availableSlots = doctor.availability.find(
        (d) => d.date.toISOString().split("T")[0] === date1
      );

      if (!availableSlots) {
        doctor.availability.push({ date: new Date(date1), slots: allSlots });
        await doctor.save();
        socket.emit("available-slots", {
          slots: allSlots,
        });
      } else {
        const available = availableSlots.slots.filter(
          (slot) =>
            slot.status === "available" ||
            (slot.lockedBy && slot.lockedBy.toString() === user_id)
        );
        if (available.length === 0) {
          socket.emit("available-slots", {
            slots: ["Slots are not available"],
          });
        }

        socket.emit("available-slots", { slots: available });
      }
    } catch (err) {
      console.log(err);
    }
  });
  socket.on("lock-slot", async (data) => {
    const { doctor_id, date, time, user_id } = data;
    console.log(data);
    const previousLockTime = 10;

    try {
      const previousSlot = await getPreviousSlot(user_id);

      const lockResult = await lockSlotInRedis(doctor_id, date, time, user_id);
      console.log("aaaaaaaaaaaaaaaa", lockResult);

      if (previousSlot) {
        setTimeout(async () => {
          const {
            doctor_id: prevDoctorId,
            date: prevDate,
            time: prevTime,
          } = previousSlot;

          await unlockSlotInRedis(prevDoctorId, prevDate, prevTime);
          deletePreviousSlot(user_id);
        }, 10 * 1000);
      } // Unlock after 10 seconds
      console.log("after");
      savePreviousSlot(user_id, doctor_id, date, time);
      setTimeout(async () => {
        const lock = await isSlotLockedInRedis(doctor_id, date, time);
        console.log("lock", lock);
        if (lock == user_id) {
          console.log("lockddd");
          await unlockSlotInRedis(doctor_id, date, time);
        }
      }, 30 * 1000);
      console.log("end");
    } catch (error) {
      console.error("Error locking slot:", error);
    }
  });
  socket.on("appoinment", async (data) => {
    const { role,user_id } = data;
    console.log(data); 
    let user="";
    if(role==="patient"){
       const patients=await User.findById(user_id).populate({path:"patients",populate:{path:"appoinments"}});
       user=patients;
    }
    if(role==="doctor"){
     user = await Doctor.findById(user_id).populate({
      path: "appoinments",
      populate: { path: "patient", populate: { path: "user" } },
    });
  }


    

    socket.emit("fetch-appoinment", { user: user });
  });
});

// const store = MongoStore.create({
//   mongoUrl: process.env.MONGO_URL,
//   collectionName:"sessions",
//   crypto: {
//     secret: process.env.SECRET,
//   },
//   touchAfter: 24 * 3600,
// });
// store.on("error", () => {
//   console.log("error in mongo session store", err);
// });

// const sessionoption = {
//   store,
//   secret: process.env.SECRET,
//   resave: false,
//   saveUninitialized: true,
//   cookie: {
//     expires: Date.now() + 7 * 24 * 60 * 30 * 1000, //like 7 days
//     maxAge: 7 * 24 * 60 * 30 * 1000,
//     httpOnly: true, //for prevent cross site scripting attack
//   },
// };
require("./passport.js");
// app.use(session(sessionoption));

app.use(passport.initialize());
// app.use(passport.session());

const generateTimeSlots = (selectedDate) => {
  const slots = [];
  let startTime = new Date(selectedDate).setHours(9, 0, 0, 0); // 9:00 AM
  const endTime = new Date(selectedDate).setHours(20, 0, 0, 0); // 8:00 PM

  while (startTime < endTime) {
    slots.push({
      time: new Date(startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      status: "available",
      lockedBy: null,
    });
    startTime = new Date(startTime).setMinutes(
      new Date(startTime).getMinutes() + 30
    );
  }
  return slots;
};

app.get("/", (req, res) => {
  res.send("hello world");
});

app.get(
  "/patient-dashboard",
  passport.authenticate("jwt", { session: false }),
  async(req, res) => {
    const user=await User.findById(req.user._id).populate("patients");
    console.log(user);

    
    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        patients: user.patients,
      },
    });
  }
);
app.get(
  "/doctor-dashboard",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    

    return res.status(200).json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        email: req.user.email,
        role: req.user.role,
        user_id: req.user.doctor,
        
      },
    });
  }
);

app.post("/register", upload.single("photo"), async (req, res) => {
  console.log(req.body);
  let { username, email, phonenumber, password } = req.body;

  let url = req.file.path;
  let filename = req.file.filename;
  console.log(url, filename);

  let user1 = new User({
    username: username,
    email: email,
    phonenumber: phonenumber,
    photo: { url, filename },
    password: hashSync(password, 10),
  });

  let newuser = await user1.save();
  // // req.login(newuser, (err) => {
  // //   //user for create session
  // //   if (err) {
  // //     return next(err);
  // //   }

  // });
});

app.post("/login", (req, res, next) => {
  console.log(req.body);
  User.findOne({ email: req.body.email }).then((user) => {
    //no user
    if (!user) {
      return next(new ExpressError(401, "Could not find the user"));
    }

    //incrrect password
    if (!compareSync(req.body.password, user.password)) {
      return next(new ExpressError(401, "Incorrect password"));
    }

    const payload = {
      username: user.username,
      id: user._id,
      role: user.role,
    };

    const token = jwt.sign(payload, "secretOrPrivateKey", { expiresIn: "1d" });

    return res.status(200).json({
      success: true,
      user: { id: user._id, role: user.role },
      message: "login successfully",
      token: "Bearer " + token,
    });
  });
});

app.post(
  "/patient/patient-form",
  passport.authenticate("jwt", { session: false }),
  async (req, res) => {
    console.log(req.body);
    const { birth_date, gender, address, full_name, contact } = req.body;
    const date = birth_date.slice(0, 10);
    const patient = new Patient({
      full_name: full_name,
      address: address,
      birth_date: date,
      contact: contact,
      gender: gender,
      user: req.user._id,
    });

    const newpatient = await patient.save();
    const patientid = newpatient._id.toString();
    console.log(patientid);
    const user = await User.findById(req.user._id);
    user.patients.push(patient);
    await user.save();

    res.status(200).json({
      success: true,
      message: "Success",
      patient_id: patientid,
    });
  }
);
// app.post('/logout', (req, res) => {
//   const token = req.headers.authorization.split(' ')[1];

//   // Blacklist the token
//   blacklist.push(token);

//   res.json({ message: 'Successfully logged out' });
// });

//error handling middleware

app.get("/doctor", async (req, res) => {
  console.log("done");
  const alldoctor = await Doctor.find({});
  res.status(200).json({
    success: true,
    doctor: {
      alldoctor: alldoctor,
    },
    status: 200,
  });
});

app.post("/patient/appoinment-form", async (req, res) => {
  console.log(req.body);
  const { doctor_id, appoinmentTime, reason, date, patient_id } = req.body;
  const date1 = date.slice(0, 10);
  const doctor = await Doctor.findById(doctor_id);

  const existingSlot = doctor.availability.find(
    (slot) => slot.date.toISOString().split("T")[0] === date1
  );
  const slot = existingSlot.slots.find((slot) => slot.time === appoinmentTime);
  slot.status = "booked";
  slot.lockedBy = null;
  await doctor.save();
  const appoinment = new Appoinment({
    doctor: doctor_id,
    time: appoinmentTime,
    reason: reason,
    date: date,
    patient: patient_id,
  });
  await appoinment.save();
  doctor.appoinments.push(appoinment);

  await doctor.save();
  const patient = await Patient.findById(patient_id);
  patient.appoinments.push(appoinment);
  await patient.save();
  res.status(200).json({
    success: true,
    message: "Appoinment created",
  });
  const availableSlots = doctor.availability.find(
    (d) => d.date.toISOString().split("T")[0] === date1
  );

  console.log(availableSlots);
  io.emit("slots-updated", {
    time: appoinmentTime,
    status: "booked",
  });
  


  
  

  

});


// app.post("/doctor/available-slots", async (req, res) => {
//   console.log(req.body);
//   const { currSelectedDoctor, date } = req.body;
//   const doctor = await Doctor.findById(currSelectedDoctor);
//   const date1 = date.slice(0, 10);
//   const allSlots = generateTimeSlots(date1);

//   const availableSlots = doctor.availability.find(
//     (date) => date.date.toISOString().split("T")[0] === date1
//   );
//   console.log(availableSlots);

//   if (!availableSlots) {
//     return res.status(200).json({
//       success: true,
//       slots: allSlots,
//     });
//   }

//   const available = allSlots.filter(
//     (slot) => !availableSlots.slots.includes(slot)
//   );
//   if (available.length === 0) {
//     return res.status(200).json({
//       success: true,
//       slots: ["Slots are not available"],
//     });
//   }
//   console.log(available);
//   res.status(200).json({
//     success: true,
//     slots: available,
//   });

// });

// app.post("/doctor/find-doctor", async (req, res) => {
//   console.log(req.body);
//   const { user_id } = req.body;
//   const doctor = await Doctor.findById(user_id).populate({
//     path: "appoinments",
//     populate: { path: "patient", populate: { path: "user" } },
//   });
//   res.status(200).json({
//     success: true,
//     doctor: doctor,
//   });
// });

app.post("/doctor/completed", async (req, res) => { 
  console.log(req.body);
  const { appoinment_id } = req.body;
  const appoinment = await Appoinment.findById(appoinment_id);
  appoinment.status="completed";
  await appoinment.save();
  res.status(200).json({
    success: true,
    message: "Appoinment completed",
  });
});





server.listen(3000, () => {
  console.log("Server is listening on port 3000");
});
