package br.ifsp.demo.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import java.util.regex.Pattern;

public class CorValidValidator implements ConstraintValidator<ValidCor, String> {

    private static final Pattern APENAS_NUMEROS = Pattern.compile("^\\d+$");
    private static final Pattern CARACTERES_ESPECIAIS = Pattern.compile("[^a-zA-ZÀ-ÿ\\s]");
    private static final String[] CORES_VALIDAS = {
            "branco", "preto", "prata", "cinza", "vermelho", "azul", "verde",
            "amarelo", "laranja", "roxo", "rosa", "marrom", "bege", "dourado",
            "bronze", "vinho", "bordo", "creme", "off-white", "grafite"
    };

    @Override
    public boolean isValid(String cor, ConstraintValidatorContext context) {
        if (cor == null || cor.trim().isEmpty()) {
            return false;
        }

        String corLimpa = cor.trim().toLowerCase();

        if (APENAS_NUMEROS.matcher(corLimpa).matches()) {
            context.disableDefaultConstraintViolation();
                context.buildConstraintViolationWithTemplate(
                    "Color cannot be a number. Use names like: white, black, blue, etc."
                ).addConstraintViolation();
            return false;
        }

        if (CARACTERES_ESPECIAIS.matcher(corLimpa).find()) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                    "Color cannot contain special characters (@#!$%). Use letters only."
            ).addConstraintViolation();
            return false;
        }

        if (corLimpa.length() < 3) {
            context.disableDefaultConstraintViolation();
            context.buildConstraintViolationWithTemplate(
                    "Color must have at least 3 characters"
            ).addConstraintViolation();
            return false;
        }

        return true;
    }
}
