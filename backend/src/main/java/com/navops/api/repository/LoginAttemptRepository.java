package com.navops.api.repository;

import com.navops.api.domain.entity.LoginAttempt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.OffsetDateTime;
import java.util.UUID;

@Repository
public interface LoginAttemptRepository extends JpaRepository<LoginAttempt, UUID> {
    
    int countByUsernameAndSuccessFalseAndAttemptTimeAfter(String username, OffsetDateTime time);
    
    int countByIpAddressAndSuccessFalseAndAttemptTimeAfter(String ipAddress, OffsetDateTime time);
}
