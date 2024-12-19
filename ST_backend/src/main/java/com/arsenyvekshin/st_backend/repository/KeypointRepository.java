package com.arsenyvekshin.st_backend.repository;

import com.arsenyvekshin.st_backend.entity.Keypoint;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KeypointRepository extends JpaRepository<Keypoint, Long> {

}
