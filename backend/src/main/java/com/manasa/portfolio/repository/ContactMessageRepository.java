package com.manasa.portfolio.repository;

import com.manasa.portfolio.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Spring Data JPA Repository for ContactMessage entity.
 */
@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    /**
     * Fetch all messages sorted by submission timestamp in descending order.
     */
    List<ContactMessage> findAllByOrderByCreatedAtDesc();

    /**
     * Search messages matching name, email, or subject keywords.
     */
    @Query("SELECT m FROM ContactMessage m WHERE " +
           "LOWER(m.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.email) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.subject) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           "LOWER(m.message) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "ORDER BY m.createdAt DESC")
    List<ContactMessage> searchMessages(@Param("keyword") String keyword);
}
