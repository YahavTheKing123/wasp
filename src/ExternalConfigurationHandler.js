import axios from 'axios';
import config from './config';

class ExternalConfigurationHandler {

    externalConfigurationHandler = null;

    async getConfiguration() {
        if (!this.externalConfigurationHandler) {
            try {
                const configRes = await axios.get(config.urls.configuration);
                this.externalConfigurationHandler = configRes.data;
                return this.externalConfigurationHandler;
            } catch (e) {
                console.error('error when trying to retreive configuration.json', e);
            }
        }
        return this.externalConfigurationHandler;
    }
}

export default new ExternalConfigurationHandler();