package com.arsenyvekshin.st_backend.repository;

import com.arsenyvekshin.st_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    User findByUsername(String login);

    @Query("select u.username from Users u where u.roleRequest = true")
    List<String> getUnapprovedUsers();

    @Query("select u.username from Users u")
    List<String> getUsersList();
}

