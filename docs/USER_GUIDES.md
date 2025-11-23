# Membership Approval System - User Guides

## Table of Contents

- [For Athletes](#for-athletes)
  - [Getting Started](#getting-started-athletes)
  - [Submitting Your Application](#submitting-your-application)
  - [Checking Application Status](#checking-application-status)
  - [After Approval](#after-approval)
  - [If Your Application is Rejected](#if-your-application-is-rejected)
  - [Common Questions (Athletes)](#common-questions-athletes)
- [For Coaches](#for-coaches)
  - [Getting Started](#getting-started-coaches)
  - [Viewing Applications](#viewing-applications)
  - [Reviewing Application Details](#reviewing-application-details)
  - [Approving Applications](#approving-applications)
  - [Rejecting Applications](#rejecting-applications)
  - [Best Practices for Coaches](#best-practices-for-coaches)
  - [Common Questions (Coaches)](#common-questions-coaches)
- [For Admins](#for-admins)
  - [Getting Started](#getting-started-admins)
  - [Managing All Applications](#managing-all-applications)
  - [Handling Special Cases](#handling-special-cases)
  - [System Maintenance](#system-maintenance)
  - [Common Questions (Admins)](#common-questions-admins)

---

## For Athletes

### Getting Started (Athletes)

Welcome to the Sports Club Management System! This guide will help you apply for membership in your chosen sports club.

**What You'll Need:**
- A registered account (email and password)
- Personal information (name, date of birth, phone number)
- Emergency contact information
- Required documents:
  - ID card photo or scan
  - Medical certificate (if required by your club)
  - Any other documents specified by the club

**Important Notes:**
- You can only have ONE pending application at a time
- Once approved, you'll be assigned to a coach automatically
- If rejected, you can reapply after addressing the issues mentioned

---

### Submitting Your Application

Follow these detailed steps to submit your membership application:

#### Step 1: Login to Your Account

1. Go to the login page
2. Enter your email and password
3. Click "เข้าสู่ระบบ" (Login)

**Troubleshooting:**
- Forgot password? Click "ลืมรหัสผ่าน" to reset
- Don't have an account? Click "สมัครสมาชิก" to register


#### Step 2: Navigate to Registration Page

1. After logging in, look for the "สมัครสมาชิก" (Register Membership) button or link
2. You may find it in:
   - The main navigation menu
   - Your dashboard if you don't have an active membership
   - The pending approval page if you haven't applied yet

**What You'll See:**
- A registration form with multiple sections
- Club selection area
- Personal information fields
- Document upload section

#### Step 3: Select Your Club

This is a crucial step - choose carefully!

1. **Browse Available Clubs:**
   - Scroll through the list of clubs
   - Each club card shows:
     - Club name
     - Sport type (e.g., ฟุตบอล, บาสเกตบอล, วอลเลย์บอล)
     - Brief description
     - Number of members
     - Number of coaches

2. **Search and Filter:**
   - Use the search box to find clubs by name
   - Filter by sport type if available
   - Click on a club card to see more details

3. **Review Club Details:**
   - Read the club description carefully
   - Check the sport type matches your interest
   - Verify the club has coaches (coach_count > 0)
   - Note: You CANNOT select a specific coach - you'll be assigned after approval

4. **Select Your Club:**
   - Click the "เลือก" (Select) button on your chosen club
   - The club card will be highlighted
   - You can change your selection before submitting

**Important:**
- You can only apply to ONE club at a time
- Make sure the club has active coaches
- You cannot change clubs after submission without reapplying


#### Step 4: Fill Personal Information

Complete all required fields accurately:

1. **Basic Information:**
   - **ชื่อ-นามสกุล** (Full Name): Enter your complete name as it appears on your ID
   - **วันเกิด** (Date of Birth): Select from the date picker
   - **เบอร์โทรศัพท์** (Phone Number): Enter your mobile number (format: 08XXXXXXXX)

2. **Emergency Contact:**
   - **ชื่อผู้ติดต่อฉุกเฉิน** (Emergency Contact Name): Parent, guardian, or close relative
   - **เบอร์ติดต่อฉุกเฉิน** (Emergency Contact Number): Their phone number

3. **Optional Information:**
   - **ที่อยู่** (Address): Your current address (optional but recommended)
   - **ข้อมูลสุขภาพ** (Medical Conditions): Any health issues coaches should know about
     - Allergies
     - Chronic conditions
     - Injuries
     - Medications

**Tips:**
- Double-check all information for accuracy
- Use Thai or English as appropriate
- Be honest about medical conditions - it's for your safety
- All fields marked with * are required

#### Step 5: Upload Required Documents

Prepare and upload clear, readable documents:

1. **ID Card Photo:**
   - Take a clear photo of your ID card (front side)
   - Ensure all text is readable
   - Accepted formats: JPG, PNG, PDF
   - Maximum size: 5MB

2. **Medical Certificate (if required):**
   - Get a certificate from a licensed doctor
   - Should be dated within the last 6 months
   - Must state you're fit for sports activities
   - Accepted formats: JPG, PNG, PDF
   - Maximum size: 5MB

3. **How to Upload:**
   - Click "เลือกไฟล์" (Choose File) button
   - Select your document from your device
   - Wait for upload to complete (you'll see a progress bar)
   - Verify the file name appears correctly
   - You can remove and re-upload if needed

**Common Issues:**
- **File too large:** Compress the image or use a PDF
- **Upload fails:** Check your internet connection
- **Wrong file type:** Convert to JPG, PNG, or PDF


#### Step 6: Review and Submit

Before submitting, carefully review everything:

1. **Review Checklist:**
   - ✅ Club selected correctly
   - ✅ All personal information accurate
   - ✅ Emergency contact provided
   - ✅ All required documents uploaded
   - ✅ Medical information disclosed (if any)

2. **Submit Your Application:**
   - Click "ส่งใบสมัคร" (Submit Application) button
   - You'll see a confirmation dialog
   - Click "ยืนยัน" (Confirm) to proceed

3. **What Happens Next:**
   - Your application status changes to "pending"
   - You'll be redirected to a waiting page
   - The coach of your selected club will be notified
   - You cannot submit another application until this one is processed

**Success Message:**
You should see: "ส่งใบสมัครเรียบร้อยแล้ว รอการพิจารณาจากโค้ช" (Application submitted successfully. Waiting for coach review.)

---

### Checking Application Status

Stay informed about your application progress:

#### Accessing Your Application

1. **Login** to your account
2. **Navigate** to one of these locations:
   - Dashboard → "ใบสมัครของฉัน" (My Applications)
   - Direct link: `/dashboard/athlete/applications`
   - Or you may be automatically redirected to the pending page

#### Understanding Status Indicators

Your application can have one of these statuses:

**🕐 Pending (รอการพิจารณา)**
- **What it means:** Your application is waiting for coach review
- **What you see:**
  - Clock icon
  - "รอการอนุมัติ" message
  - Club name you applied to
  - Application submission date
- **What you can do:**
  - Wait patiently (coaches typically review within 3-7 days)
  - Check back regularly for updates
  - Ensure your contact information is correct
- **What you CANNOT do:**
  - Access athlete dashboard features
  - Submit another application
  - Attend training sessions

**✅ Approved (อนุมัติแล้ว)**
- **What it means:** Congratulations! Your application was approved
- **What you see:**
  - Green checkmark icon
  - "อนุมัติแล้ว" message
  - Your assigned coach's name
  - Club information
- **What you can do:**
  - Access full athlete dashboard
  - View training schedule
  - Check in to sessions
  - View your attendance history
  - Contact your coach
- **Next steps:** See "After Approval" section below


**❌ Rejected (ปฏิเสธ)**
- **What it means:** Your application was not approved
- **What you see:**
  - Red X icon
  - "ปฏิเสธ" message
  - **Rejection reason** (very important - read carefully!)
  - "สมัครอีกครั้ง" (Apply Again) button
- **What you can do:**
  - Read the rejection reason carefully
  - Fix the issues mentioned
  - Reapply with corrected information
- **Common rejection reasons:**
  - Incomplete documents
  - Unclear ID card photo
  - Missing medical certificate
  - Incorrect or incomplete personal information
  - Age requirements not met
  - Club at full capacity

**⏸️ Suspended (ระงับชั่วคราว)**
- **What it means:** Your membership has been temporarily suspended
- **What you see:**
  - Warning icon
  - "ระงับชั่วคราว" message
  - Instructions to contact admin
- **What you should do:**
  - Contact the system administrator
  - Resolve any outstanding issues
  - Wait for reactivation

#### Viewing Application Details

Click on your application to see:
- Full application information
- All uploaded documents
- Activity timeline showing:
  - When you submitted
  - When coach reviewed
  - Any status changes
- Current status and next steps

---

### After Approval

Once your application is approved, you gain full access to the system:

#### First Steps After Approval

1. **Explore Your Dashboard:**
   - Navigate to `/dashboard/athlete`
   - You'll see your personalized athlete dashboard

2. **Meet Your Coach:**
   - Your coach's name is displayed on your dashboard
   - You've been automatically assigned to them
   - They will guide your training

3. **View Training Schedule:**
   - Go to "ตารางฝึก" (Schedule) section
   - See upcoming training sessions
   - Note the times and locations

4. **Complete Your Profile:**
   - Go to "โปรไฟล์" (Profile) section
   - Add a profile photo
   - Update any additional information
   - Set your preferences


#### Using the Athlete Dashboard

Your dashboard provides access to:

**📊 Dashboard Overview:**
- Attendance statistics
- Upcoming sessions
- Recent activity
- Quick actions

**📅 Schedule:**
- View all training sessions
- See session details (time, location, coach)
- Check in to sessions
- Request leave if you can't attend

**📈 Attendance:**
- View your attendance history
- See attendance rate
- Track your progress
- View leave requests

**👤 Profile:**
- Update personal information
- Change contact details
- Update medical information
- View your assigned coach and club

**📝 Applications:**
- View your approved application
- See application history
- Access submitted documents

---

### If Your Application is Rejected

Don't be discouraged! Follow these steps to reapply successfully:

#### Step 1: Understand Why

1. **Read the Rejection Reason Carefully:**
   - The coach has provided specific feedback
   - This tells you exactly what needs to be fixed
   - Common issues and solutions:

**"เอกสารไม่ชัดเจน" (Documents not clear)**
- Solution: Take new, clearer photos
- Ensure good lighting
- Make sure all text is readable
- Use a scanner if possible

**"ข้อมูลไม่ครบถ้วน" (Incomplete information)**
- Solution: Fill in all required fields
- Double-check for missing information
- Provide complete emergency contact details

**"ใบรับรองแพทย์หมดอายุ" (Medical certificate expired)**
- Solution: Get a new medical certificate
- Must be dated within last 6 months
- From a licensed doctor

**"อายุไม่ตรงตามเกณฑ์" (Age requirements not met)**
- Solution: Check club's age requirements
- Consider applying to a different club
- Wait until you meet the age requirement


#### Step 2: Fix the Issues

1. **Gather Corrected Information/Documents:**
   - Address each point mentioned in the rejection
   - Prepare better quality documents
   - Update any incorrect information
   - Get new certificates if needed

2. **Prepare Better Than Before:**
   - Use higher quality photos
   - Scan documents instead of photographing
   - Double-check all information
   - Ask someone to review before submitting

#### Step 3: Reapply

1. **Click "สมัครอีกครั้ง" (Apply Again) Button:**
   - Found on the rejected application page
   - This will take you to a new application form

2. **Complete the New Application:**
   - Follow all steps from "Submitting Your Application" section
   - Pay special attention to the areas that were rejected
   - Ensure all corrections are made

3. **Add a Note (if possible):**
   - Some systems allow you to add notes
   - Mention what you've corrected
   - Example: "ได้แนบใบรับรองแพทย์ฉบับใหม่แล้วครับ" (New medical certificate attached)

4. **Submit and Wait:**
   - Your new application will be reviewed
   - Usually faster than the first review
   - Coach will see your previous application history

**Tips for Success:**
- Don't rush - take time to fix issues properly
- Ask for help if you're unsure about requirements
- Contact the club directly if you have questions
- Be patient and professional

---

### Common Questions (Athletes)

**Q: How long does approval take?**
A: Typically 3-7 days, but can vary by club. Coaches review applications regularly, but may take longer during busy periods.

**Q: Can I apply to multiple clubs?**
A: No, you can only have ONE pending application at a time. After approval or rejection, you could apply to a different club.

**Q: Can I choose my coach?**
A: No, coaches are assigned automatically after approval based on the club you selected.

**Q: What if I made a mistake in my application?**
A: You cannot edit a submitted application. If it's minor, wait for coach review. If it's major, you may need to wait for rejection and reapply.

**Q: Can I cancel my pending application?**
A: Not directly through the UI. Contact an administrator if you need to cancel.

**Q: What if my application expires?**
A: Applications pending for more than 30 days are automatically rejected. You'll need to reapply.

**Q: Do I need to pay any fees?**
A: Check with your specific club. The application system doesn't handle payments currently.

**Q: What if I don't have a medical certificate?**
A: Check if your club requires it. If required, you must obtain one from a licensed doctor before applying.


---

## For Coaches

### Getting Started (Coaches)

Welcome, Coach! This guide will help you review and manage membership applications for your club.

**Your Responsibilities:**
- Review applications for your club only
- Approve qualified applicants
- Reject applications with clear, constructive feedback
- Respond to applications in a timely manner (within 7 days recommended)
- Maintain fair and consistent standards

**What You Can Do:**
- View all applications for your club
- See applicant details and documents
- Approve applications (athletes are automatically assigned to you)
- Reject applications with reasons
- View application history and activity logs

**What You Cannot Do:**
- See applications from other clubs
- Approve applications for clubs you don't coach
- Edit applicant information directly
- Delete applications

---

### Viewing Applications

#### Accessing the Applications Page

1. **Login** to your coach account
2. **Navigate** to Applications:
   - From dashboard: Click "ใบสมัคร" (Applications) in the sidebar
   - Direct link: `/dashboard/coach/applications`

3. **What You'll See:**
   - List of applications for YOUR club only
   - Application cards showing:
     - Applicant name
     - Application date
     - Current status
     - Quick action buttons

#### Understanding the Applications List

**Application Statuses:**
- **🕐 Pending (รอการพิจารณา):** Needs your review
- **✅ Approved (อนุมัติแล้ว):** You or another coach approved
- **❌ Rejected (ปฏิเสธ):** You or another coach rejected

**Filtering and Sorting:**
- **By Status:** View only pending, approved, or rejected
- **By Date:** Newest first (default) or oldest first
- **Search:** Find specific applicants by name

**Priority Indicators:**
- Applications older than 7 days may be highlighted
- New applications (within 24 hours) may have a badge
- Applications nearing expiry (>25 days) may show a warning


---

### Reviewing Application Details

#### Opening an Application

1. **Click on an application card** to open the detail modal
2. **The modal displays:**
   - Applicant's full information
   - All uploaded documents
   - Application timeline
   - Action buttons (Approve/Reject)

#### What to Review

**1. Personal Information:**
- ✅ Name matches ID card
- ✅ Age appropriate for club
- ✅ Contact information complete
- ✅ Emergency contact provided

**2. Documents:**
- ✅ ID card photo is clear and readable
- ✅ Medical certificate is recent (within 6 months)
- ✅ All required documents uploaded
- ✅ Documents are authentic (not edited/fake)

**3. Medical Information:**
- ✅ Any health conditions disclosed
- ✅ Conditions are manageable for sports activity
- ✅ No contraindications for the sport
- ⚠️ Flag serious conditions for special attention

**4. Overall Assessment:**
- ✅ Applicant meets club requirements
- ✅ Information is complete and accurate
- ✅ Documents are valid and clear
- ✅ No red flags or concerns

#### Viewing Documents

1. **Click on document thumbnails** to view full size
2. **Zoom in** to check details
3. **Download** if you need to review offline
4. **Check for:**
   - Clarity and readability
   - Authenticity
   - Expiration dates
   - Completeness

**Red Flags to Watch For:**
- Blurry or unreadable documents
- Expired certificates
- Inconsistent information
- Missing required documents
- Suspicious or edited documents

---

### Approving Applications

When an application meets all requirements:

#### Step 1: Final Verification

Before approving, confirm:
- ✅ All information is accurate
- ✅ All documents are valid
- ✅ Applicant meets club criteria
- ✅ You're ready to coach this athlete
- ✅ Club has capacity for new members


#### Step 2: Click Approve

1. **Click "อนุมัติ" (Approve) button** in the application modal
2. **Review the confirmation dialog:**
   - Applicant name
   - Club name
   - Confirmation that athlete will be assigned to you

3. **Click "ยืนยัน" (Confirm)** to proceed

#### Step 3: What Happens After Approval

**Automatic Actions:**
1. Application status changes to "approved"
2. Athlete profile is created automatically
3. Athlete is assigned to YOU as their coach
4. Athlete's membership_status becomes "active"
5. Athlete gains access to athlete dashboard
6. Activity log is updated

**Athlete Can Now:**
- Access full athlete dashboard
- View training schedule
- Check in to your sessions
- See you as their assigned coach
- Contact you through the system

**Your Next Steps:**
1. Welcome the new athlete
2. Inform them of training schedule
3. Add them to your training groups
4. Brief them on club rules and expectations

**Success Message:**
You'll see: "อนุมัติใบสมัครเรียบร้อยแล้ว" (Application approved successfully)

---

### Rejecting Applications

When an application doesn't meet requirements:

#### Step 1: Identify Issues

Before rejecting, clearly identify what's wrong:
- Missing or incomplete information
- Unclear or invalid documents
- Doesn't meet club requirements
- Capacity issues
- Other concerns

**Important:** You MUST provide a clear, constructive rejection reason.

#### Step 2: Click Reject

1. **Click "ปฏิเสธ" (Reject) button** in the application modal
2. **A dialog appears** asking for rejection reason

#### Step 3: Write Rejection Reason

This is crucial - your feedback helps the applicant improve:

**Good Rejection Reasons (Specific and Constructive):**
- ✅ "เอกสารบัตรประชาชนไม่ชัดเจน กรุณาถ่ายภาพใหม่ให้เห็นข้อความทั้งหมด" (ID card photo unclear, please take a new photo showing all text)
- ✅ "ใบรับรองแพทย์หมดอายุ (ลงวันที่ 2023-01-15) กรุณาแนบใบรับรองฉบับใหม่ที่ออกภายใน 6 เดือน" (Medical certificate expired (dated 2023-01-15), please attach new certificate issued within 6 months)
- ✅ "ข้อมูลผู้ติดต่อฉุกเฉินไม่ครบถ้วน กรุณาระบุชื่อและเบอร์โทรศัพท์" (Emergency contact incomplete, please provide name and phone number)
- ✅ "อายุต่ำกว่าเกณฑ์ของชมรม (ต้อง 15 ปีขึ้นไป) กรุณาสมัครอีกครั้งเมื่ออายุครบ" (Age below club requirement (must be 15+), please reapply when age requirement is met)


**Bad Rejection Reasons (Vague or Unhelpful):**
- ❌ "ไม่ผ่าน" (Not approved) - Too vague
- ❌ "เอกสารไม่ดี" (Documents not good) - Not specific
- ❌ "ไม่เหมาะสม" (Not suitable) - Doesn't explain why
- ❌ "ลองใหม่" (Try again) - No guidance

**Template for Rejection Reasons:**
```
[ปัญหาที่พบ] + [วิธีแก้ไข] + [คำแนะนำเพิ่มเติม]
[Problem found] + [How to fix] + [Additional guidance]

Example:
"ภาพถ่ายบัตรประชาชนมืดเกินไป ไม่สามารถอ่านข้อความได้ กรุณาถ่ายภาพใหม่ในที่ที่มีแสงสว่างเพียงพอ หรือใช้เครื่องสแกนเอกสาร"
(ID card photo too dark, text unreadable. Please take new photo in well-lit area or use document scanner)
```

#### Step 4: Confirm Rejection

1. **Type your rejection reason** in the text area
2. **Review your message** - is it clear and helpful?
3. **Click "ยืนยันปฏิเสธ" (Confirm Rejection)**

#### Step 5: What Happens After Rejection

**Automatic Actions:**
1. Application status changes to "rejected"
2. Rejection reason is saved
3. Athlete's membership_status becomes "rejected"
4. Athlete is notified
5. Activity log is updated

**Athlete Can:**
- See the rejection reason
- Fix the issues
- Reapply with corrected information

**Your Responsibility:**
- Be available to answer questions if athlete contacts you
- Review reapplication fairly
- Maintain consistent standards

---

### Best Practices for Coaches

#### Response Time

**Recommended Timeline:**
- Review new applications within 3 days
- Respond to all applications within 7 days
- Prioritize applications older than 5 days

**Why It Matters:**
- Athletes are waiting to start training
- Applications expire after 30 days
- Quick response improves athlete experience
- Shows professionalism

#### Fair and Consistent Review

**Do:**
- ✅ Apply same standards to all applicants
- ✅ Focus on objective criteria
- ✅ Give everyone a fair chance
- ✅ Be professional and respectful
- ✅ Provide constructive feedback

**Don't:**
- ❌ Discriminate based on personal factors
- ❌ Rush through reviews
- ❌ Reject without clear reasons
- ❌ Be overly strict or lenient
- ❌ Ignore club guidelines


#### Document Verification Tips

**ID Card Verification:**
- Check photo matches applicant (if you know them)
- Verify ID number format is correct
- Ensure expiration date is valid
- Look for signs of tampering or editing

**Medical Certificate Verification:**
- Check it's from a licensed medical facility
- Verify doctor's signature and stamp
- Ensure date is within 6 months
- Confirm it states fitness for sports

**Red Flags:**
- Pixelated or heavily compressed images
- Inconsistent information across documents
- Suspicious editing marks
- Missing official stamps or signatures

#### Communication

**If You Need More Information:**
- Unfortunately, you cannot directly message applicants through the system
- You can reject with specific requests: "กรุณาแนบเอกสาร X เพิ่มเติม" (Please attach additional document X)
- Applicant will see this when they reapply

**If You're Unsure:**
- Consult with other coaches
- Check club guidelines
- Contact administrator for guidance
- When in doubt, err on the side of caution

#### Managing Your Workload

**If You Have Many Applications:**
1. Sort by date - review oldest first
2. Batch review similar applications
3. Set aside dedicated time for reviews
4. Use filters to focus on pending only

**If You're Away:**
- Inform administrator
- Another coach from your club can review
- Set expectations with your club

---

### Common Questions (Coaches)

**Q: Can I see applications from other clubs?**
A: No, you can only see applications for clubs you coach. This is enforced by database security policies.

**Q: Can I reject an application without a reason?**
A: No, rejection reason is required. This helps athletes understand what to improve.

**Q: What if I accidentally approve/reject?**
A: Contact an administrator immediately. They can help reverse the decision if needed.

**Q: Can I approve an application for another coach?**
A: No, approved athletes are automatically assigned to YOU. If another coach should handle them, that coach should approve the application.

**Q: What if an applicant has a serious medical condition?**
A: Review carefully. If the condition is manageable and they have medical clearance, you can approve. If you're concerned, consult with medical professionals or reject with guidance to get additional medical documentation.

**Q: How many athletes can I have?**
A: Check with your club's capacity limits. The system doesn't enforce a hard limit, but you should manage your workload appropriately.

**Q: What if documents are in a foreign language?**
A: If you cannot verify the documents, reject with a request for translated versions or documents in Thai/English.

**Q: Can I edit an applicant's information?**
A: No, you cannot edit their information. If corrections are needed, reject with specific instructions for what needs to be fixed.


---

## For Admins

### Getting Started (Admins)

Welcome, Administrator! This guide covers your elevated privileges for managing the membership approval system.

**Your Responsibilities:**
- Oversee all applications across all clubs
- Handle special cases and exceptions
- Resolve disputes and issues
- Maintain system integrity
- Support coaches and athletes
- Monitor system performance

**Your Privileges:**
- View ALL applications from ALL clubs
- Approve/reject any application
- Override coach decisions
- Access detailed system logs
- Modify membership statuses directly
- Reassign athletes to different coaches
- View comprehensive statistics

**Important Notes:**
- With great power comes great responsibility
- Document all administrative actions
- Maintain fairness and transparency
- Support coaches rather than replacing them
- Only intervene when necessary

---

### Managing All Applications

#### Accessing the Admin Applications Dashboard

1. **Login** with admin credentials
2. **Navigate** to Admin Dashboard:
   - From main menu: Click "Admin" or "ผู้ดูแลระบบ"
   - Then click "Applications" or "ใบสมัคร"
   - Direct link: `/dashboard/admin/applications`

3. **What You'll See:**
   - Comprehensive dashboard with statistics
   - All applications from all clubs
   - Advanced filtering options
   - Bulk action capabilities (if available)

#### Dashboard Overview

**Key Statistics:**
- Total applications (all time)
- Pending applications (need attention)
- Approved this month
- Rejected this month
- Average approval time
- Applications by club
- Applications by status

**Visual Indicators:**
- Charts showing trends over time
- Club comparison graphs
- Status distribution pie charts
- Coach performance metrics


#### Advanced Filtering

**Filter by Club:**
- Select specific club from dropdown
- View applications for that club only
- Compare clubs side-by-side

**Filter by Status:**
- Pending - needs review
- Approved - successfully processed
- Rejected - not approved
- All - see everything

**Filter by Date Range:**
- Last 7 days
- Last 30 days
- Last 3 months
- Custom date range
- Specific month/year

**Filter by Coach:**
- See applications reviewed by specific coach
- Identify coach performance
- Find unreviewed applications

**Search:**
- Search by applicant name
- Search by email
- Search by application ID

**Combined Filters:**
- Use multiple filters together
- Example: "Pending applications for Football club in last 7 days"
- Save common filter combinations

#### Reviewing Applications as Admin

**Same Process as Coaches, Plus:**
- You can approve/reject for ANY club
- You can override previous decisions
- You can see full activity history
- You can access system logs

**When to Intervene:**
- Coach hasn't responded in >7 days
- Dispute or complaint from athlete
- Special circumstances
- System errors or issues
- Policy exceptions

**When NOT to Intervene:**
- Coach is actively reviewing
- No complaints or issues
- Normal processing timeline
- Coach has valid reasons for decision

---

### Handling Special Cases

#### Overriding Coach Decisions

**When It's Appropriate:**
- Coach made clear error
- New information available
- Policy exception approved
- Athlete appeal is valid
- System error occurred

**How to Override:**

1. **Document the Reason:**
   - Why are you overriding?
   - What new information exists?
   - Who requested the override?

2. **Access the Application:**
   - Find application in admin dashboard
   - Open full details

3. **Change Status:**
   - If overriding rejection → Approve
   - If overriding approval → More complex (see below)

4. **Add Admin Notes:**
   - Document your action
   - Explain reasoning
   - Reference any tickets or communications

5. **Notify Affected Parties:**
   - Inform the coach
   - Inform the athlete
   - Document the notification


#### Reassigning Athletes

**Scenario:** Athlete needs different coach

**Steps:**
1. Access athlete's profile in database
2. Update `coach_id` field
3. Update `club_id` if changing clubs
4. Notify both old and new coach
5. Notify athlete
6. Document reason for reassignment

**SQL Example:**
```sql
-- Update athlete's coach
UPDATE profiles 
SET coach_id = 'new-coach-uuid'
WHERE user_id = 'athlete-uuid';

-- Also update in athletes table if exists
UPDATE athletes
SET coach_id = 'new-coach-uuid'
WHERE user_id = 'athlete-uuid';
```

#### Manually Updating Membership Status

**Scenario:** Need to change athlete's status directly

**Possible Status Values:**
- `pending` - Awaiting approval
- `active` - Approved and active
- `rejected` - Application rejected
- `suspended` - Temporarily suspended

**Steps:**
1. Access database or admin panel
2. Find athlete's profile
3. Update `membership_status` field
4. Document reason
5. Notify athlete

**SQL Example:**
```sql
-- Activate an athlete
UPDATE profiles 
SET membership_status = 'active'
WHERE user_id = 'athlete-uuid';

-- Suspend an athlete
UPDATE profiles 
SET membership_status = 'suspended'
WHERE user_id = 'athlete-uuid';
```

**When to Use:**
- System errors
- Special circumstances
- Emergency situations
- Data migration issues

**Caution:**
- Always document why
- Ensure data consistency
- Check related records
- Notify affected parties

#### Handling Expired Applications

**Automatic Expiry:**
- Applications >30 days old are auto-rejected
- Runs via `expire_old_applications()` function
- Should be scheduled as cron job

**Manual Expiry:**
```sql
-- Run expiry function manually
SELECT expire_old_applications();

-- Check results
SELECT COUNT(*) 
FROM membership_applications 
WHERE status = 'rejected' 
  AND rejection_reason = 'คำขอหมดอายุ (เกิน 30 วัน)';
```

**Preventing Expiry:**
- Monitor pending applications
- Alert coaches about old applications
- Follow up on applications >7 days old


#### Resolving Duplicate Applications

**Scenario:** Athlete has multiple pending applications (shouldn't happen, but might due to bugs)

**Diagnosis:**
```sql
-- Find users with multiple pending applications
SELECT user_id, COUNT(*) as pending_count
FROM membership_applications
WHERE status = 'pending'
GROUP BY user_id
HAVING COUNT(*) > 1;
```

**Resolution:**
1. Identify which application is valid
2. Reject duplicate applications
3. Keep the most recent or most complete one
4. Document the issue

**SQL Example:**
```sql
-- Reject older duplicate applications
UPDATE membership_applications
SET status = 'rejected',
    rejection_reason = 'Duplicate application - newer application exists',
    reviewed_at = NOW(),
    reviewed_by = 'admin-uuid'
WHERE user_id = 'athlete-uuid'
  AND status = 'pending'
  AND id != 'keep-this-application-uuid';
```

#### Handling Data Integrity Issues

**Common Issues:**
- Approved application but no athlete profile
- Active membership but no approved application
- Mismatched club_id between tables
- Missing coach assignments

**Verification Scripts:**
Run these regularly:
```bash
# Check data integrity
./scripts/run-sql-via-api.sh scripts/verify-membership-migration-final.sql

# Check coach-club consistency
./scripts/run-sql-via-api.sh scripts/verify-coach-club-consistency.sql

# Check approved applications have assigned coaches
./scripts/run-sql-via-api.sh scripts/verify-approved-apps-assigned-coach.sql
```

**Fixing Issues:**
See Troubleshooting section in main documentation for specific solutions.

---

### System Maintenance

#### Regular Monitoring Tasks

**Daily:**
- Check for applications >7 days old
- Monitor error logs
- Review new applications count
- Check system performance

**Weekly:**
- Review approval/rejection rates by club
- Check coach response times
- Verify data integrity
- Review athlete feedback

**Monthly:**
- Generate comprehensive reports
- Analyze trends
- Review and update policies
- Coach performance reviews
- System optimization


#### Running Maintenance Scripts

**Expire Old Applications:**
```bash
# Manual expiry
./scripts/run-sql-via-api.sh scripts/test-expire-old-applications.sql

# Set up automatic expiry (if not already)
# Add to cron or use Supabase Edge Functions
```

**Verify Data Integrity:**
```bash
# Comprehensive verification
./scripts/run-sql-via-api.sh scripts/verify-membership-migration-final.sql

# Check specific aspects
./scripts/run-sql-via-api.sh scripts/verify-coach-club-consistency.sql
./scripts/run-sql-via-api.sh scripts/verify-approved-apps-assigned-coach.sql
```

**Check RLS Policies:**
```bash
# Verify RLS policies are working
./scripts/run-sql-via-api.sh scripts/verify-rls-policies-simple.sql
```

#### Generating Reports

**Application Statistics:**
```sql
-- Applications by status
SELECT status, COUNT(*) as count
FROM membership_applications
GROUP BY status;

-- Applications by club
SELECT c.name, COUNT(a.id) as application_count
FROM clubs c
LEFT JOIN membership_applications a ON a.club_id = c.id
GROUP BY c.name
ORDER BY application_count DESC;

-- Average approval time
SELECT 
  AVG(EXTRACT(EPOCH FROM (reviewed_at - applied_at))/86400) as avg_days
FROM membership_applications
WHERE status = 'approved';
```

**Coach Performance:**
```sql
-- Applications reviewed by each coach
SELECT 
  p.first_name || ' ' || p.last_name as coach_name,
  COUNT(a.id) as reviewed_count,
  SUM(CASE WHEN a.status = 'approved' THEN 1 ELSE 0 END) as approved,
  SUM(CASE WHEN a.status = 'rejected' THEN 1 ELSE 0 END) as rejected
FROM profiles p
LEFT JOIN membership_applications a ON a.reviewed_by = p.user_id
WHERE p.role = 'coach'
GROUP BY p.first_name, p.last_name
ORDER BY reviewed_count DESC;
```

**Trend Analysis:**
```sql
-- Applications per month
SELECT 
  DATE_TRUNC('month', applied_at) as month,
  COUNT(*) as applications
FROM membership_applications
GROUP BY month
ORDER BY month DESC
LIMIT 12;
```

#### Backup and Recovery

**Regular Backups:**
- Supabase handles automatic backups
- Verify backup schedule in Supabase dashboard
- Test restore procedures periodically

**Before Major Changes:**
- Create manual backup
- Document current state
- Have rollback plan ready

**After Issues:**
- Review what went wrong
- Update procedures
- Document lessons learned


---

### Common Questions (Admins)

**Q: Should I approve applications instead of coaches?**
A: Generally no. Coaches should review their own club's applications. Only intervene when necessary (delays, disputes, special cases).

**Q: How do I handle complaints about coach decisions?**
A: 
1. Review the application and coach's reasoning
2. Check if decision follows club policies
3. If coach was wrong, override with documentation
4. If coach was right, explain to athlete
5. Use as coaching opportunity for the coach

**Q: Can I delete applications?**
A: Technically yes, but you shouldn't. Rejected applications serve as history. Only delete test data or in case of serious errors.

**Q: How do I add a new club?**
A:
```sql
INSERT INTO clubs (name, description, sport_type)
VALUES ('ชื่อชมรม', 'คำอธิบาย', 'ประเภทกีฬา');
```
Then assign coaches to the club.

**Q: How do I assign a coach to a club?**
A:
```sql
UPDATE profiles 
SET club_id = 'club-uuid'
WHERE user_id = 'coach-uuid' AND role = 'coach';
```

**Q: What if a coach leaves?**
A:
1. Reassign their athletes to another coach
2. Update their profile to remove club assignment
3. Or change their role if they're leaving entirely

**Q: How do I handle system errors?**
A:
1. Check Supabase logs
2. Review error messages
3. Check database state
4. Consult troubleshooting guide
5. Fix data inconsistencies
6. Document the issue and solution

**Q: Can I bulk approve applications?**
A: Not through the UI currently. You could write a script, but be very careful. Each application should be reviewed individually.

**Q: How do I monitor system performance?**
A:
- Supabase Dashboard > Logs
- Check query performance
- Monitor API response times
- Review database indexes
- Check RLS policy performance

**Q: What's the best way to communicate policy changes?**
A:
1. Update documentation
2. Notify all coaches via email/meeting
3. Update system messages if applicable
4. Monitor for confusion
5. Be available for questions

---

## Additional Resources

### Documentation Links

- **Main Documentation:** `docs/MEMBERSHIP_APPROVAL_SYSTEM.md`
- **Requirements:** `.kiro/specs/membership-approval-fix/requirements.md`
- **Design:** `.kiro/specs/membership-approval-fix/design.md`
- **Tasks:** `.kiro/specs/membership-approval-fix/tasks.md`
- **Troubleshooting:** See main documentation

### Code References

- **Backend Actions:** `lib/membership/actions.ts`
- **Query Functions:** `lib/membership/queries.ts`
- **Access Control:** `lib/auth/access-control.ts`
- **Registration Form:** `app/(authenticated)/register-membership/page.tsx`
- **Coach Applications:** `app/dashboard/coach/applications/page.tsx`
- **Admin Dashboard:** `app/dashboard/admin/applications/page.tsx`

### Database Scripts

- **Migrations:** `scripts/31-*.sql` through `scripts/35-*.sql`
- **Data Migration:** `scripts/37-*.sql`, `scripts/38-*.sql`
- **Verification:** `scripts/verify-*.sql`
- **Helper Functions:** `scripts/34-membership-helper-functions.sql`

### Support

**For Technical Issues:**
1. Check troubleshooting guide
2. Review error logs
3. Check database state
4. Contact development team

**For Policy Questions:**
1. Review requirements document
2. Consult with club administrators
3. Check with other coaches
4. Contact system administrator

**For Training:**
- This user guide
- Video tutorials (if available)
- Hands-on practice with test data
- Shadowing experienced users

---

## Appendix: Quick Reference

### Application Status Flow

```
null → pending → approved → active (athlete can access system)
              ↘ rejected → (can reapply)
```

### Key Timeframes

- **Coach review:** 3-7 days recommended
- **Application expiry:** 30 days
- **Expiry warning:** 7 days before expiry
- **Medical certificate validity:** 6 months

### Important Rules

1. **One pending application per athlete**
2. **Rejection reason required**
3. **Coaches see only their club's applications**
4. **Athletes assigned automatically on approval**
5. **Applications expire after 30 days**

### Contact Information

- **System Administrator:** [Contact details]
- **Technical Support:** [Contact details]
- **Club Coordinators:** [Contact details]

---

**Document Version:** 1.0  
**Last Updated:** November 23, 2024  
**Maintained By:** Development Team  
**Feedback:** Please report any issues or suggestions for improvement

