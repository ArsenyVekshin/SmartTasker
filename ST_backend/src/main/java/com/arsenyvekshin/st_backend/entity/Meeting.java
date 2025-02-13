package com.arsenyvekshin.st_backend.entity;

import com.arsenyvekshin.st_backend.dto.MeetingDto;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity(name = "Meeting")
public class Meeting implements AllocatableObject, OwnedObject, Cloneable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @NotBlank(message = "Имя задачи не может быть пустым")
    @Column(name = "name")
    private String name;

    @Column(name = "description")
    private String description;

    @Column(name = "duration")
    private Duration duration;

    @NotBlank(message = "Время начала встречи не может быть пустым")
    @Column(name = "start", nullable = false)
    private LocalDateTime start;

    @NotBlank(message = "Окончание встречи не может быть пустым")
    @Column(name = "finish", nullable = false)
    private LocalDateTime finish;

    @Column(name = "repeat_period")
    private Duration repeatPeriod;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "keypoint_id")
    private Keypoint keypoint;

    @ManyToOne
    @JoinColumn(name = "place_id")
    private Place place;

    @ManyToMany
    @JoinTable(
            name = "meeting_members",
            joinColumns = @JoinColumn(name = "meeting_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    private Task task;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "owner_id")
    private User owner;

    @PrePersist
    @PreUpdate
    protected void onCreate() {
        if(!this.start.isBefore(this.finish)) throw new IllegalArgumentException("Время начала не может быть позже времени окончания");
        this.duration = Duration.between(this.start, this.finish);
    }

    public Meeting updateByDto(MeetingDto dto) {
        this.id = dto.getId();
        this.name = dto.getName();
        this.description = dto.getDescription();
        this.duration = Duration.ofMinutes(dto.getDuration());
        this.start = dto.getBegin();
        this.finish = dto.getEnd();
        this.repeatPeriod = Duration.ofMinutes(dto.getRepeatPeriod());
        return this;
    }

    public void addMember(User user) {
        members.add(user);
    }

    public int membersNum(){return members.size();}

    @Override
    public Meeting clone() {
        try {
            Meeting clone = (Meeting) super.clone();
            return clone;
        } catch (CloneNotSupportedException e) {
            throw new AssertionError();
        }
    }
}
