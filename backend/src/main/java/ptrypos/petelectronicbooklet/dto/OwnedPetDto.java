package ptrypos.petelectronicbooklet.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDate;

public class OwnedPetDto {

    private Long id;
    private String name;
    private String species;
    private String gender;

    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;

    public OwnedPetDto(Long id, String name, String species, String gender, LocalDate birthDate) {
        this.id = id;
        this.name = name;
        this.species = species;
        this.gender = gender;
        this.birthDate = birthDate;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getSpecies() {
        return species;
    }

    public String getGender() {
        return gender;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }
}