package com.arsenyvekshin.st_backend.repository;

import com.arsenyvekshin.st_backend.entity.Board;
import com.arsenyvekshin.st_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BoardRepository extends JpaRepository<Board, Long> {

    public List<Board> getBoardsByOwner(User owner);

}
