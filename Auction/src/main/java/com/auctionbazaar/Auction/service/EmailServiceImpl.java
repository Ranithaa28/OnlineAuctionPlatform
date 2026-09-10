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


    @Override
    public String sendEmail(String to, String subject, String body) {
        try {
            // Creating Mime message for HTML support
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setTo(to);
            helper.setSubject(subject);
            
            // true indicates the text is HTML
            boolean isHtml = body.trim().startsWith("<") && body.trim().endsWith(">");
            helper.setText(body, isHtml);
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