package ptrypos.petelectronicbooklet.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class VetVisitDto {

    private Long id;
    private String petName;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate visitDate;

    private String reason;
    private String notes;

    public VetVisitDto(Long id, String petName, LocalDate visitDate, String reason, String notes) {
        this.id = id;
        this.petName = petName;
        this.visitDate = visitDate;
        this.reason = reason;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public String getPetName() {
        return petName;
    }

    public void setPetName(String petName) {
        this.petName = petName;
    }

    public LocalDate getVisitDate() {
        return visitDate;
    }

    public String getReason() {
        return reason;
    }

    public String getNotes() {
        return notes;
    }
}