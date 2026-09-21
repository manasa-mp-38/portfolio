package com.manasa.portfolio.controller;

import com.manasa.portfolio.dto.ApiResponse;
import com.manasa.portfolio.dto.ContactMessageDTO;
import com.manasa.portfolio.entity.ContactMessage;
import com.manasa.portfolio.service.ContactMessageService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for handling contact messages.
 * Provides public endpoint for submitting inquiries and secured endpoints for admin management.
 */
@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ContactMessageController {

    private static final Logger logger = LoggerFactory.getLogger(ContactMessageController.class);

    private final ContactMessageService messageService;

    @Autowired
    public ContactMessageController(ContactMessageService messageService) {
        this.messageService = messageService;
    }

    /**
     * Public endpoint to submit a contact message.
     * POST /api/contact
     */
    @PostMapping
    public ResponseEntity<ApiResponse<ContactMessage>> submitMessage(
            @Valid @RequestBody ContactMessageDTO messageDTO) {
        logger.info("Received contact form submission from: {}", messageDTO.getEmail());
        ContactMessage savedMessage = messageService.saveMessage(messageDTO);
        ApiResponse<ContactMessage> response = ApiResponse.success(
                "Message sent successfully! Thank you for reaching out.",
                savedMessage
        );
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    /**
     * Admin endpoint to get all contact messages.
     * GET /api/contact
     */
    @GetMapping
    public ResponseEntity<ApiResponse<List<ContactMessage>>> getAllMessages() {
        logger.info("Retrieving all contact messages");
        List<ContactMessage> messages = messageService.getAllMessages();
        ApiResponse<List<ContactMessage>> response = ApiResponse.success(
                "Fetched " + messages.size() + " messages successfully.",
                messages
        );
        return ResponseEntity.ok(response);
    }

    /**
     * Admin endpoint to get a single message by ID.
     * GET /api/contact/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ContactMessage>> getMessageById(@PathVariable Long id) {
        logger.info("Retrieving message with ID: {}", id);
        ContactMessage message = messageService.getMessageById(id);
        return ResponseEntity.ok(ApiResponse.success("Message retrieved successfully.", message));
    }

    /**
     * Admin endpoint to delete a message by ID.
     * DELETE /api/contact/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long id) {
        logger.info("Deleting message with ID: {}", id);
        messageService.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.success("Message deleted successfully with ID: " + id));
    }

    /**
     * Admin endpoint to mark a message as read or unread.
     * PATCH /api/contact/{id}/read?status=true
     */
    @PatchMapping("/{id}/read")
    public ResponseEntity<ApiResponse<ContactMessage>> markAsRead(
            @PathVariable Long id,
            @RequestParam(name = "status", defaultValue = "true") boolean status) {
        logger.info("Updating read status for message ID: {} to {}", id, status);
        ContactMessage updated = messageService.updateReadStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Message read status updated successfully.", updated));
    }

    /**
     * Admin endpoint to mark a message as replied or not replied.
     * PATCH /api/contact/{id}/replied?status=true
     */
    @PatchMapping("/{id}/replied")
    public ResponseEntity<ApiResponse<ContactMessage>> markAsReplied(
            @PathVariable Long id,
            @RequestParam(name = "status", defaultValue = "true") boolean status) {
        logger.info("Updating replied status for message ID: {} to {}", id, status);
        ContactMessage updated = messageService.updateRepliedStatus(id, status);
        return ResponseEntity.ok(ApiResponse.success("Message replied status updated successfully.", updated));
    }

    /**
     * Admin endpoint to search messages by keyword.
     * GET /api/contact/search?q=keyword
     */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ContactMessage>>> searchMessages(@RequestParam(name = "q", required = false) String query) {
        logger.info("Searching messages with keyword: {}", query);
        List<ContactMessage> results = messageService.searchMessages(query);
        return ResponseEntity.ok(ApiResponse.success("Search completed.", results));
    }

    /**
     * Admin endpoint to get statistics / message counts.
     * GET /api/contact/stats
     */
    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMessageStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalMessages", messageService.getMessageCount());
        return ResponseEntity.ok(ApiResponse.success("Statistics fetched successfully.", stats));
    }
}
