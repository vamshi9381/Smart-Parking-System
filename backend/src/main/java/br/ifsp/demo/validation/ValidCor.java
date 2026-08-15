package br.ifsp.demo.validation;

import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = CorValidValidator.class)
@Target({ElementType.FIELD})
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidCor {
    String message() default "Color must be a valid name, not a number";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
