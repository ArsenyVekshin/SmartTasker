package com.arsenyvekshin.st_backend.service;

import com.arsenyvekshin.st_backend.dto.BoardDto;
import com.arsenyvekshin.st_backend.entity.Board;
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
        Board obj = new Board().updateByDto(dto);
        obj.setOwner(userService.getCurrentUser());
        boardRepository.save(obj);
        return obj;
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
        boardRepository.save(board.updateByDto(dto));
        return board;
    }

    public void delete(Long id) {
        Board board = find(id);
        userService.checkOwnership(board);
        boardRepository.delete(board);
    }

    //TODO: статистика по доске?
}
