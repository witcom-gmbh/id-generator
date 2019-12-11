const fs = require('fs');


class KcResourceHelper {

    constructor() {
        console.log("Init KeyCloak-Resource-Loader");
        this.reload();

    }

    getResourceId(resourcename){
        let resource = this.resourceConfig.resources.find(res => res.name === resourcename);
        if (resource){
            return resource._id;
        }
        return null;
    }

    reload() {
        this.resourceConfig = JSON.parse(fs.readFileSync('./config/kc-resource-config.json', 'utf-8'));

    }

}




module.exports = new KcResourceHelper();

