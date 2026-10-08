package com.auctionbazaar.Auction.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailException;
import org.springframework.mail.MailSendException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

import java.util.logging.Level;
import java.util.logging.Logger;

@Service
public class EmailServiceImpl implements EmailService {

    @Autowired
    private JavaMailSender mailSender;

    private static final Logger LOGGER = Logger.getLogger(EmailServiceImpl.class.getName());

    /**
     * Wraps the given HTML content in a branded, responsive email template.
     */
    @Override
    public String wrapInEmailTemplate(String accentColor, String headerIcon, String headerTitle, String bodyContent) {
        return "<div style=\"font-family: Arial, sans-serif; background-color: #f4f4f7; padding: 20px;\">" +
                "<div style=\"max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);\">" +
                "<div style=\"background-color: " + accentColor.split(",")[0] + "; color: #ffffff; padding: 20px; text-align: center;\">" +
                "<h1>" + headerIcon + " " + headerTitle + "</h1>" +
                "</div>" +
                "<div style=\"padding: 30px; color: #333333; line-height: 1.6;\">" +
                bodyContent +
                "</div>" +
                "<div style=\"text-align: center; padding: 15px; font-size: 12px; color: #888888; background: #f9f9f9;\">" +
                "&copy; Auction Bazaar. All rights reserved." +
                "</div>" +
                "</div>" +
                "</div>";
    }

    @Override
    public String sendEmail(String to, String subject, String body) {
        try {
            // Creating Mime message for HTML support
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            
            // All emails sent from this application are HTML formatted
            helper.setText(body, true);
            helper.setFrom("ranithaaravichandran@gmail.com"); // Ensure this email is verified in Brevo/SMTP provider

            // Sending email
            mailSender.send(message);
            LOGGER.info("✅ Email sent successfully to " + to);
            return "✅ Email sent successfully to " + to;

        } catch (MailSendException e) {
            LOGGER.log(Level.SEVERE, "❌ MailSendException: Failed to send email - SMTP settings might be incorrect.", e);
            return "❌ Error: Failed to send email. Check SMTP configuration.";

        } catch (MailException e) {
            LOGGER.log(Level.SEVERE, "❌ MailException: Email sending failed - Invalid email format or SMTP issue.", e);
            return "❌ Error: Unable to send email. Check recipient address and SMTP settings.";

        } catch (Exception e) {
            LOGGER.log(Level.SEVERE, "❌ General Exception: An unexpected error occurred while sending email.", e);
            return "❌ Unexpected error occurred while sending email.";
        }
    }

}