package com.navops.api.repository;

import com.navops.api.domain.entity.CrewMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CrewMemberRepository extends JpaRepository<CrewMember, UUID> {
    boolean existsByFileNumber(String fileNumber);
    boolean existsByMaritimeBookNumber(String maritimeBookNumber);
}
