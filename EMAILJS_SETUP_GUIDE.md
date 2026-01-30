# EmailJS Setup Guide

This guide will help you set up EmailJS for the contact form in your application.

## Step 1: Create EmailJS Account

1. Go to [https://www.emailjs.com/](https://www.emailjs.com/)
2. Sign up for a free account (or log in if you already have one)
3. The free plan includes 200 emails per month

## Step 2: Create Email Service

1. In your EmailJS dashboard, go to **Email Services**
2. Click **Add New Service**
3. Choose your email provider (Gmail, Outlook, etc.)
4. Follow the setup instructions for your provider
5. **Copy the Service ID** (you'll need this later)

## Step 3: Create Email Template

1. Go to **Email Templates** in your EmailJS dashboard
2. Click **Create New Template**
3. Set up your template with these variables:
   - `{{from_name}}` - Sender's name
   - `{{from_email}}` - Sender's email
   - `{{phone}}` - Sender's phone number
   - `{{message}}` - Message content
   - `{{to_email}}` - Your business email (puscartdeliveryservice@gmail.com)

4. Example template:
   ```
   Subject: New Contact Form Submission from {{from_name}}
   
   You have received a new message from your website contact form.
   
   Name: {{from_name}}
   Email: {{from_email}}
   Phone: {{phone}}
   
   Message:
   {{message}}
   
   ---
   This email was sent from your Puscart website contact form.
   ```

5. **Copy the Template ID** (you'll need this later)

## Step 4: Get Public Key

1. Go to **Account** → **General** in your EmailJS dashboard
2. Find **Public Key** section
3. **Copy the Public Key** (you'll need this later)

## Step 5: Add Environment Variables

1. In your project root, open or create `.env` file
2. Add the following variables:

```env
VITE_EMAILJS_SERVICE_ID=your_service_id_here
VITE_EMAILJS_TEMPLATE_ID=your_template_id_here
VITE_EMAILJS_PUBLIC_KEY=your_public_key_here
```

3. Replace the placeholder values with your actual IDs from Steps 2, 3, and 4

**Example:**
```env
VITE_EMAILJS_SERVICE_ID=service_abc123
VITE_EMAILJS_TEMPLATE_ID=template_xyz789
VITE_EMAILJS_PUBLIC_KEY=abcdefghijklmnop
```

## Step 6: Restart Development Server

After adding environment variables, restart your development server:

```bash
npm run dev
```

## Step 7: Test the Contact Form

1. Go to the Contact page in your app
2. Fill out the contact form
3. Click "Send Message"
4. Check your email inbox for the message

## Troubleshooting

### Issue: "EmailJS is not configured"
- Make sure you've added all three environment variables to `.env`
- Restart your development server after adding variables
- Check that variable names start with `VITE_`

### Issue: "Failed to send message"
- Verify your Service ID, Template ID, and Public Key are correct
- Check that your email service is properly connected in EmailJS dashboard
- Verify the template variables match what's in your code:
  - `from_name`
  - `from_email`
  - `phone`
  - `message`
  - `to_email`

### Issue: Emails not received
- Check your spam folder
- Verify the "to_email" in your template is correct
- Check EmailJS dashboard for any error messages
- Verify your email service connection is active

### Issue: Template variables not working
- Make sure variable names in template match exactly (case-sensitive)
- Use double curly braces: `{{variable_name}}`
- Check that all required variables are included in the template

## Security Notes

✅ **Public Key is safe to use in frontend** - EmailJS public keys are designed for client-side use
✅ **Rate limiting** - Free plan has 200 emails/month limit
✅ **No backend required** - EmailJS handles email sending from the browser

## Production Deployment

When deploying to production:

1. Add the same environment variables to your hosting platform:
   - Vercel: Project Settings → Environment Variables
   - Netlify: Site Settings → Environment Variables
   - Other platforms: Check their documentation for environment variables

2. Make sure to use the same variable names with `VITE_` prefix

3. Redeploy your application after adding variables

## Next Steps

- ✅ EmailJS integrated
- ✅ Contact form sends emails
- 🔄 Consider adding email validation
- 🔄 Add reCAPTCHA for spam protection (optional)
- 🔄 Set up email notifications for admin

---

**Need Help?** Check EmailJS documentation: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
