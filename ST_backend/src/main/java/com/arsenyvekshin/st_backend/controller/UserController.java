package com.arsenyvekshin.st_backend.controller;

import com.arsenyvekshin.st_backend.dto.MessageInfoDto;
import com.arsenyvekshin.st_backend.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/user")
@RequiredArgsConstructor
@Tag(name = "Управление пользователями", description = "Методы для управления пользователями")
public class UserController {
    private final UserService userService;

    @Operation(summary = "Получить список пользователей")
    @GetMapping("/list")
    public List<String> getUserList() {
        return userService.getUsersList();
    }


    @ExceptionHandler(RuntimeException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public MessageInfoDto error(Exception ex) {
        return new MessageInfoDto(ex.getMessage());
    }

}