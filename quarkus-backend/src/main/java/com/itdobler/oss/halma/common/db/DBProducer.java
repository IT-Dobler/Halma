package com.itdobler.oss.halma.common.db;

import jakarta.enterprise.context.RequestScoped;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequestScoped
public class DBProducer {

    // TODO Yanic, analyse why we this producer is advised, what speaks against just having an application scoped class
    //  that is injected into the Repositories
}
