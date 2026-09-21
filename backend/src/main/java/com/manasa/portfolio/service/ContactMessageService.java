package com.manasa.portfolio.service;

import com.manasa.portfolio.dto.ContactMessageDTO;
import com.manasa.portfolio.entity.ContactMessage;
import com.manasa.portfolio.exception.ResourceNotFoundException;
import com.manasa.portfolio.repository.ContactMessageRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Service class for business logic related to contact messages.
 */
@Service
@Transactional
public class ContactMessageService {

    private static final Logger logger = LoggerFactory.getLogger(ContactMessageService.class);

    private final ContactMessageRepository repository;

    @Autowired
    public ContactMessageService(ContactMessageRepository repository) {
        this.repository = repository;
    }

    /**
     * Save a new contact message submitted from the frontend.
     */
    public ContactMessage saveMessage(ContactMessageDTO dto) {
        logger.info("Saving new contact message from sender: {} <{}>", dto.getName(), dto.getEmail());
        ContactMessage message = new ContactMessage(
                dto.getName().trim(),
                dto.getEmail().trim(),
                dto.getSubject().trim(),
                dto.getMessage().trim()
        );
        ContactMessage saved = repository.save(message);
        logger.info("Successfully persisted contact message with ID: {}", saved.getId());
        return saved;
    }

    /**
     * Retrieve all messages in descending chronological order.
     */
    @Transactional(readOnly = true)
    public List<ContactMessage> getAllMessages() {
        logger.info("Fetching all contact messages for admin view");
        return repository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Retrieve a specific message by its ID.
     */
    @Transactional(readOnly = true)
    public ContactMessage getMessageById(Long id) {
        logger.info("Fetching message with ID: {}", id);
        return repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Contact message not found with ID: " + id));
    }

    /**
     * Delete a contact message by ID.
     */
    public void deleteMessage(Long id) {
        logger.info("Attempting to delete message with ID: {}", id);
        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException("Cannot delete: Contact message not found with ID: " + id);
        }
        repository.deleteById(id);
        logger.info("Successfully deleted contact message with ID: {}", id);
    }

    /**
     * Mark a message as read or unread.
     */
    public ContactMessage updateReadStatus(Long id, boolean readStatus) {
        logger.info("Updating read status for message ID: {} to {}", id, readStatus);
        ContactMessage message = getMessageById(id);
        message.setReadStatus(readStatus);
        return repository.save(message);
    }

    /**
     * Mark a message as replied or not replied.
     */
    public ContactMessage updateRepliedStatus(Long id, boolean replied) {
        logger.info("Updating replied status for message ID: {} to {}", id, replied);
        ContactMessage message = getMessageById(id);
        message.setReplied(replied);
        return repository.save(message);
    }

    /**
     * Search messages by keyword across name, email, subject, and message.
     */
    @Transactional(readOnly = true)
    public List<ContactMessage> searchMessages(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return getAllMessages();
        }
        logger.info("Searching messages with keyword: {}", keyword);
        return repository.searchMessages(keyword.trim());
    }

    /**
     * Return total count of received messages.
     */
    @Transactional(readOnly = true)
    public long getMessageCount() {
        return repository.count();
    }
}
