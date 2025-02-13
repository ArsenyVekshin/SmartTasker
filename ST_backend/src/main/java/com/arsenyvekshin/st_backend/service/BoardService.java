package com.arsenyvekshin.st_backend.service;

import com.arsenyvekshin.st_backend.dto.BoardDto;
import com.arsenyvekshin.st_backend.entity.Board;
import com.arsenyvekshin.st_backend.entity.User;
import com.arsenyvekshin.st_backend.repository.BoardRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final UserService userService;

    public Board create(BoardDto dto) {
        Board board = new Board().updateByDto(dto);
        board.setOwner(userService.getCurrentUser());
        boardRepository.save(build(board, dto));
        return board;
    }

    public Board find(Long id) {
        try {
            Optional<Board> board = boardRepository.findById(id);
            if (board.isPresent()) return board.get();
            else throw new IllegalArgumentException("Доска не найдена");
        } catch (Exception e) {
            throw new InternalError(e);
        }
    }

    public Board update(BoardDto dto) {
        Board board = find(dto.getId());
        userService.checkOwnership(board);
        boardRepository.save(build(board, dto));
        return board;
    }

    public void delete(Long id) {
        Board board = find(id);
        userService.checkOwnership(board);
        boardRepository.delete(board);
    }

    private Board build(Board board, BoardDto dto) {
        board.updateByDto(dto);

        if (dto.getOwner() != null) {
            User user = userService.getByUsername(dto.getOwner());
            if(user == null) board.setOwner(userService.getCurrentUser());
            else board.setOwner(user);
        } else {
            board.setOwner(userService.getCurrentUser());
        }
        return board;

    }

    //TODO: статистика по доске?
}
