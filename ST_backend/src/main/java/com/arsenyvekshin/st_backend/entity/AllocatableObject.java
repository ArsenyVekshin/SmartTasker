package com.arsenyvekshin.st_backend.entity;

import java.time.Duration;
import java.time.LocalDateTime;

public interface AllocatableObject {
    Duration getDuration();

    LocalDateTime getStart();

    LocalDateTime getFinish();
    String getName();
}
