package ptrypos.petelectronicbooklet.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public class AddPetDto {

    @NotBlank(message = "Full name is required")
    @Pattern(regexp = "^[a-zA-Z ]{3,32}$", message = "Only letters and spaces allowed, 3-32 characters")
    private String name;

    private String species;

    private String gender;

    @JsonProperty("birthDate")
    @JsonFormat(pattern = "dd-MM-yyyy")
    private LocalDate birthDate;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSpecies() {
        return species;
    }

    public void setSpecies(String species) {
        this.species = species;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public LocalDate getBirthDate() {
        return birthDate;
    }

    public void setBirthDate(LocalDate birthDate) {
        this.birthDate = birthDate;
    }
}