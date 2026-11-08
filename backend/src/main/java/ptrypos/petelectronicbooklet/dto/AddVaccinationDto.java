package ptrypos.petelectronicbooklet.dto;

public class AddVaccinationDto {

    private String name;
    private String dateGiven;
    private String validUntil;

    public AddVaccinationDto(String name, String dateGiven, String validUntil) {
        this.name = name;
        this.dateGiven = dateGiven;
        this.validUntil = validUntil;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDateGiven() {
        return dateGiven;
    }

    public void setDateGiven(String dateGiven) {
        this.dateGiven = dateGiven;
    }

    public String getValidUntil() {
        return validUntil;
    }

    public void setValidUntil(String validUntil) {
        this.validUntil = validUntil;
    }
}