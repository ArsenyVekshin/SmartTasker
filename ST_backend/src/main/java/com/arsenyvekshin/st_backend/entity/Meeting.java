package com.arsenyvekshin.st_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity(name = "Meeting")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Имя задачи не может быть пустым")
    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "duration")
    private Duration duration;

    @NotBlank(message = "Время начала встречи не может быть пустым")
    @Column(name = "begin", nullable = false)
    private LocalDateTime begin;

    @NotBlank(message = "Окончание встречи не может быть пустым")
    @Column(name = "end", nullable = false)
    private LocalDateTime end;

    @Column(name = "repeatPeriod")
    private Duration repeatPeriod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keypoint_id")
    private Keypoint keypoint;

    @ManyToOne
    @JoinColumn(name = "place_id", nullable = false)
    private Place place;

    @ManyToMany
    @JoinTable(
            name =  "MeetingMembers",
            joinColumns  = @JoinColumn(name = "meeting_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @PostPersist
    protected void onCreate() {
        this.duration = Duration.between(this.begin, this.end);
    }
}
