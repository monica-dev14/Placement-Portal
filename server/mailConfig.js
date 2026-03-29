const nodemailer = require('nodemailer');

// Nodemailer example
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});


const sendPlacementEmail = async (jobDetails, recipients) => { 
    try {
        const { companyName, role, package, rounds } = jobDetails;

        
        if (!recipients || recipients.length === 0) {
            console.log("⚠️ No students found to send email.");
            return;
        }

        const mailOptions = {
            from: '"SIT Placement Cell" <moni14.9.2004@gmail.com>',
             to: recipients.join(','), 
            subject: `🚀 New Recruitment Drive: ${companyName}`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 25px; border: 1px solid #e2e8f0; border-radius: 15px; max-width: 600px; margin: auto;">
                    <div style="background-color: #1e3a8a; color: white; padding: 15px; border-radius: 10px 10px 0 0; text-align: center;">
                        <h1 style="margin: 0; font-size: 20px;">SIT PLACEMENT NOTIFICATION</h1>
                    </div>
                    
                    <div style="padding: 20px; color: #334155;">
                        <p style="font-size: 16px;">Hello Students,</p>
                        <p>A new recruitment drive has been posted for <strong>${companyName}</strong>.</p>
                        
                        <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
                            <p style="margin: 5px 0;"><strong>🏢 Company:</strong> ${companyName}</p>
                            <p style="margin: 5px 0;"><strong>🎯 Role:</strong> ${role}</p>
                            <p style="margin: 5px 0;"><strong>💰 Package:</strong> ${package}</p>
                            <p style="margin: 5px 0;"><strong>📝 Rounds:</strong> ${rounds ? rounds.join(' → ') : 'Aptitude, Technical, HR'}</p>
                        </div>
                        
                        <p>Please log in to the <strong>SIT Placement Portal</strong> to apply immediately.</p>
                        
                        <div style="text-align: center; margin-top: 30px;">
                            <a href="http://localhost:5173" style="background-color: #1e3a8a; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Go to Portal</a>
                        </div>
                    </div>
                    
                    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-top: 30px;">
                    <p style="font-size: 12px; color: #64748b; text-align: center;">
                        This is an automated notification from Sethu Institute of Technology.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Success: Notification sent to ${recipients.length} students!`);
    } catch (error) {
        console.error("❌ Mail Configuration Error:", error.message);
    }
};

module.exports = { sendPlacementEmail };