package ptrypos.petelectronicbooklet.dto;

public class AddVetVisitDto {

    private String visitDate;
    private String reason;
    private String notes;

    public AddVetVisitDto(String visitDate, String reason, String notes) {
        this.visitDate = visitDate;
        this.reason = reason;
        this.notes = notes;
    }

    public String getVisitDate() {
        return visitDate;
    }

    public void setVisitDate(String visitDate) {
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