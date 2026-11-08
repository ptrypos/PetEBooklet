package ptrypos.petelectronicbooklet.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import java.time.LocalDate;

public class VaccinationDto {

    private Long id;
    private String petName;
    private String vaccineName;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate dateGiven;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate validUntil;

    public VaccinationDto(Long id, String petName, String vaccineName, LocalDate dateGiven, LocalDate validUntil) {
        this.id = id;
        this.petName = petName;
        this.vaccineName = vaccineName;
        this.dateGiven = dateGiven;
        this.validUntil = validUntil;
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

    public String getVaccineName() {
        return vaccineName;
    }

    public LocalDate getDateGiven() {
        return dateGiven;
    }

    public LocalDate getValidUntil() {
        return validUntil;
    }
}