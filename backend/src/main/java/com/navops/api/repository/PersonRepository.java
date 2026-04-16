package com.navops.api.repository;

import com.navops.api.domain.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PersonRepository extends JpaRepository<Person, UUID> {
    boolean existsByDocumentNumber(String documentNumber);
    boolean existsByEmail(String email);
    Optional<Person> findByDocumentNumber(String documentNumber);
}
