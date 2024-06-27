package com.itdobler.oss.halma.quarkus;

import jakarta.annotation.Nullable;
import org.hibernate.boot.model.naming.Identifier;
import org.hibernate.boot.model.naming.PhysicalNamingStrategy;
import org.hibernate.engine.jdbc.env.spi.JdbcEnvironment;

/**
 * Hasn't become required, yet...
 */
public class LiquibaseQuarkusCompatiblePhysicalNamingStrategy implements PhysicalNamingStrategy {
    private static @Nullable Identifier allLowerCase(@Nullable Identifier name) {
        if (name == null) {
            return null;
        }

        String lowerCase = name.getText().toLowerCase();

        return Identifier.toIdentifier(lowerCase);
    }

    @Override
    public Identifier toPhysicalCatalogName(Identifier identifier, JdbcEnvironment jdbcEnvironment) {
        return allLowerCase(identifier);
    }

    @Override
    public Identifier toPhysicalSchemaName(Identifier identifier, JdbcEnvironment jdbcEnvironment) {
        return allLowerCase(identifier);
    }

    @Override
    public Identifier toPhysicalTableName(Identifier identifier, JdbcEnvironment jdbcEnvironment) {
        return allLowerCase(identifier);
    }

    @Override
    public Identifier toPhysicalSequenceName(Identifier identifier, JdbcEnvironment jdbcEnvironment) {
        return allLowerCase(identifier);
    }

    @Override
    public Identifier toPhysicalColumnName(Identifier identifier, JdbcEnvironment jdbcEnvironment) {
        return allLowerCase(identifier);
    }
}
