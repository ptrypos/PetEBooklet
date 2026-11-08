package ptrypos.petelectronicbooklet.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "VetVisits")
public class VetVisit {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "pet_id")
    private Pet pet;

    private LocalDate visitDate;

    private String reason;

    private String notes;

    public VetVisit() {
    }

    public VetVisit(Pet pet) {
        this.pet = pet;
    }

    public VetVisit(Pet pet, LocalDate visitDate, String reason, String notes) {
        this.pet = pet;
        this.visitDate = visitDate;
        this.reason = reason;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public Pet getPet() {
        return pet;
    }

    public void setPet(Pet pet) {
        this.pet = pet;
    }

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(LocalDate visitDate) {
        this.visitDate = visitDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}