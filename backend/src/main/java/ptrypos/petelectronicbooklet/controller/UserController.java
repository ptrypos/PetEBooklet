package ptrypos.petelectronicbooklet.controller;

import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import ptrypos.petelectronicbooklet.dto.AddPetDto;
import ptrypos.petelectronicbooklet.dto.OwnedPetDto;
import ptrypos.petelectronicbooklet.dto.UserLoginDto;
import ptrypos.petelectronicbooklet.dto.UserRegistrationDto;
import ptrypos.petelectronicbooklet.service.UserService;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("api/users")
public class UserController {

    @Autowired
    UserService userService;

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody UserRegistrationDto userRegistrationDto) {
        userService.registerUser(userRegistrationDto);

        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully!");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> loginUser(@Valid @RequestBody UserLoginDto userLoginDto) {
        String token = userService.loginUser(userLoginDto);
        Map<String, String> response = new HashMap<>();
        response.put("token", token);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/get_pets")
    public ResponseEntity<List<OwnedPetDto>> getPets(Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        List<OwnedPetDto> pets = userService.getPets(userId);
        return ResponseEntity.ok(pets);
    }

    @PostMapping("/add_pet")
    public ResponseEntity<Map<String, String>> addPet(@Valid @RequestBody AddPetDto addPetDto, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        userService.addPet(addPetDto, userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Pet successfully added");
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @DeleteMapping("/remove_pet/{petId}")
    public ResponseEntity<Map<String, String>> removePet(@PathVariable Long petId, Authentication authentication) {
        Long userId = (Long) authentication.getPrincipal();
        userService.removePet(petId, userId);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Pet successfully removed");
        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}