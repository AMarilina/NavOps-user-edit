package com.navops.api.repository;

import com.navops.api.domain.entity.CrewMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface CrewMemberRepository extends JpaRepository<CrewMember, UUID> {

    // Consulta nativa para obtener el valor de la secuencia
    @Query(value = "SELECT nextval('personnel_file_seq')", nativeQuery = true)
    Long getNextFileSequenceValue();

    boolean existsByFileNumber(String fileNumber);
    boolean existsByMaritimeBookNumber(String maritimeBookNumber);
}
