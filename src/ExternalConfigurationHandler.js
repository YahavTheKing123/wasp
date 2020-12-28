class ExternalConfigurationHandler {

    externalConfigurationHandler = null;
    
    setConfiguration(configuration) {
        this.externalConfigurationHandler = configuration;
    }

    getConfiguration() {
        return this.externalConfigurationHandler;
    }
}

export default new ExternalConfigurationHandler();