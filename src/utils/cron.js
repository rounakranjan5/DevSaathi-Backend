const cron = require("node-cron");
const { subDays, startOfDay, endOfDay } = require("date-fns");
const sendEmail = require("./sendMail"); 
const ConnectionRequestModel = require("../models/connectionRequest");

console.log("📧 Initializing weekly email cron job...");

cron.schedule("0 5 * * 7", async () => {
  console.log("Starting weekly email job at:", new Date());
  
  try {
    const sevenDaysAgo = subDays(new Date(), 7);
    const weekStart = startOfDay(sevenDaysAgo);
    const now = new Date();

    console.log(`Looking for requests between ${weekStart} and ${now}`);

    const pendingRequests = await ConnectionRequestModel.find({
      status: "interested",
      createdAt: {
        $gte: weekStart,
        $lte: now, 
      },
    }).populate("fromUserId toUserId");

    console.log(`Found ${pendingRequests.length} pending requests`);

    if (pendingRequests.length === 0) {
      console.log("No pending requests found for this period");
      return;
    }

    const requestsByEmail = {};
    
    pendingRequests.forEach(req => {
      const email = req.toUserId?.emailId;
      if (email) {
        if (!requestsByEmail[email]) {
          requestsByEmail[email] = {
            user: req.toUserId,
            requests: []
          };
        }
        requestsByEmail[email].requests.push(req);
      }
    });

    const emailCount = Object.keys(requestsByEmail).length;
    console.log(`Will send emails to ${emailCount} users`);

    let emailsSent = 0;
    let emailsFailed = 0;

    for (const [email, data] of Object.entries(requestsByEmail)) {
      try {
        const { user, requests } = data;
        
        const senderNames = requests.map(req => 
          `${req.fromUserId.firstName} ${req.fromUserId.lastName || ''}`
        ).join(', ');
        
        const subject = `${requests.length} Pending Connection Request${requests.length > 1 ? 's' : ''} - devSaathi`;
        const message = `Hi ${user.firstName}!\n\nYou have ${requests.length} pending connection request${requests.length > 1 ? 's' : ''} from: ${senderNames}.\n\nPlease login to DevSaathi to accept or reject these requests.\n\nBest regards,\ndevSaathi Team`;

        console.log(`Sending email to ${user.firstName} (${email}) - ${requests.length} requests`);
        
        const res = await sendEmail.run(email, subject, message); 
        console.log(`Email sent to ${email}:`, res);
        
        emailsSent++;
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (err) {
        emailsFailed++;
        console.error(`Failed to send email to ${email}:`, err.message);
      }
    }
    
    console.log(`Email job completed: ${emailsSent} sent, ${emailsFailed} failed`);
    
  } catch (err) {
    console.error("Error in cron job:", err);
  }
}, {
  timezone: "Asia/Kolkata" 
});

console.log("Weekly email cron job scheduled successfully");