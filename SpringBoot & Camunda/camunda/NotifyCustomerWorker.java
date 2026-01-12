package com.example.loan_management_system.camunda;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
import org.camunda.bpm.client.ExternalTaskClient;
import org.camunda.bpm.client.task.ExternalTask;
import org.camunda.bpm.client.task.ExternalTaskService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import jakarta.annotation.PostConstruct;

@Component
public class NotifyCustomerWorker {

    private static final Logger logger = LoggerFactory.getLogger(NotifyCustomerWorker.class);

    // Twilio credentials (use your own)
    public static final String ACCOUNT_SID = "";
    public static final String AUTH_TOKEN = "";
    public static final String FROM_NUMBER = "+12202991845";

    @PostConstruct
    public void startWorker() {
        Twilio.init(ACCOUNT_SID, AUTH_TOKEN);

        ExternalTaskClient client = ExternalTaskClient.create()
                .baseUrl("http://localhost:8080/engine-rest")
                .asyncResponseTimeout(10000)
                .build();

        logger.info("🔔 NotifyCustomerWorker started automatically, waiting for tasks...");

        client.subscribe("notify-customer")
                .lockDuration(5000)
                .handler((ExternalTask externalTask, ExternalTaskService externalTaskService) -> {
                    try {
                        String applicationNumber = (String) externalTask.getVariable("applicationNumber");
                        Boolean approved = (Boolean) externalTask.getVariable("approved");
                        String customerPhone = (String) externalTask.getVariable("customerPhone");

                        // Check the notify flag
                        Boolean notify = (Boolean) externalTask.getVariable("notify");
                        if (notify == null || !notify) {
                            logger.info("⚠️ Skipping SMS for application {} because notify=false or missing", applicationNumber);
                            externalTaskService.complete(externalTask);
                            return;
                        }

                        // Skip if no phone number
                        if (customerPhone == null || customerPhone.isBlank()) {
                            logger.info("⚠️ Skipping SMS for application {}: no phone number provided", applicationNumber);
                            externalTaskService.complete(externalTask);
                            return;
                        }

                        logger.info("📢 Sending SMS for application: {}", applicationNumber);
                        sendSMS(customerPhone, applicationNumber, approved);
                        externalTaskService.complete(externalTask);
                        logger.info("✅ External task completed for application: {}", applicationNumber);

                    } catch (Exception e) {
                        logger.error("❌ Error processing external task for application {}: {}",
                                externalTask.getVariable("applicationNumber"), e.getMessage(), e);
                        externalTaskService.handleFailure(externalTask, e.getMessage(), e.getMessage(), 1000, 3);
                    }
                })
                .open();
    }

    private void sendSMS(String toNumber, String applicationNumber, Boolean approved) {
        String messageBody = approved
                ? "🎉 Your loan application #" + applicationNumber + " has been APPROVED."
                : "❌ Your loan application #" + applicationNumber + " has been REJECTED.";

        Message message = Message.creator(
                        new com.twilio.type.PhoneNumber(toNumber),
                        new com.twilio.type.PhoneNumber(FROM_NUMBER),
                        messageBody
                ).create();

        logger.info("📱 SMS sent to {} for application {}: SID={}", toNumber, applicationNumber, message.getSid());
    }
}
