module.exports = {
    createDefaultFunctionalGroups: createDefaultFunctionalGroups,
    generatePermissions: generatePermissions
};

const functionalGroupDataObj = {
    "Base-4": {
        userConsentPrompt: null,
        getPermissionsFunc: base4
    },
    "Location-1": {
        userConsentPrompt: "Location",
        getPermissionsFunc: location1
    },
    "Notifications": {
        userConsentPrompt: "Notifications",
        getPermissionsFunc: notifications
    },
    "DrivingCharacteristics-3": {
        userConsentPrompt: "DrivingCharacteristics",
        getPermissionsFunc: drivingCharacteristics3
    },
    "VehicleInfo-3": {
        userConsentPrompt: "VehicleInfo",
        getPermissionsFunc: vehicleInfo3
    },
    "PropriataryData-1": {
        userConsentPrompt: null,
        getPermissionsFunc: propriataryData1
    },
    "PropriataryData-2": {
        userConsentPrompt: null,
        getPermissionsFunc: propriataryData2
    },
    "ProprietaryData-3": {
        userConsentPrompt: null,
        getPermissionsFunc: proprietaryData3
    },
    "Emergency-1": {
        userConsentPrompt: null,
        getPermissionsFunc: emergency1
    },
    "Navigation-1": {
        userConsentPrompt: null,
        getPermissionsFunc: navigation1
    },
    "Base-6": {
        userConsentPrompt: null,
        getPermissionsFunc: base6
    },
    "OnKeyboardInputOnlyGroup": {
        userConsentPrompt: null,
        getPermissionsFunc: onKeyboardInputOnlyGroup
    },
    "OnTouchEventOnlyGroup": {
        userConsentPrompt: null,
        getPermissionsFunc: onTouchEventOnlyGroup
    },
    "DiagnosticMessageOnly": {
        userConsentPrompt: null,
        getPermissionsFunc: diagnosticMessageOnly
    },
    "DataConsent-2": {
        userConsentPrompt: "DataConsent",
        getPermissionsFunc: diagnosticMessageOnly
    },
    "BaseBeforeDataConsent": {
        userConsentPrompt: null,
        getPermissionsFunc: baseBeforeDataConsent
    },
    "SendLocation": {
        userConsentPrompt: null,
        getPermissionsFunc: sendLocation
    },
    "WayPoints": {
        userConsentPrompt: null,
        getPermissionsFunc: wayPoints
    },
    "BackgroundAPT": {
        userConsentPrompt: null,
        getPermissionsFunc: backgroundApt
    },
};

function createDefaultFunctionalGroups () {
    let functionGroupInfos = [];
    for (let prop in functionalGroupDataObj) {
        functionGroupInfos.push(defineFunctionGroupInfo(prop, functionalGroupDataObj[prop].userConsentPrompt));
    }
    return functionGroupInfos;
}

function defineFunctionGroupInfo (propertyName, userConsentPrompt) {
    let obj = {
        property_name: propertyName
    };
    if (userConsentPrompt !== undefined && userConsentPrompt !== null) {
        obj.user_consent_prompt = userConsentPrompt;
    }
    return obj;
}

function generatePermissions () {
    let rpcPermissionObjs = [];
    let vehiclePermissionObjs = [];

    for (let functionalGroupName in functionalGroupDataObj) {
        const associatedPerms = functionalGroupDataObj[functionalGroupName].getPermissionsFunc();
        const permissionsArray = addPermissionsTemplate(associatedPerms[0], associatedPerms[1], functionalGroupName);

        rpcPermissionObjs = rpcPermissionObjs.concat(permissionsArray[0]);
        vehiclePermissionObjs = vehiclePermissionObjs.concat(permissionsArray[1]);
    }
    return {
        rpcPermissions: rpcPermissionObjs,
        vehiclePermissions: vehiclePermissionObjs
    };
}

function addPermissionsTemplate (addRpcArray, addVehicleArray, functionalGroupName) {
    let rpcPermissions = [];
    let vehicleDataPermissions = [];
    for (let i = 0; i < addRpcArray.length; i++) {
        rpcPermissions.push(addRpcPermission(addRpcArray[i], functionalGroupName));
    }
    for (let i = 0; i < addVehicleArray.length; i++) {
        if (addVehicleArray[i] !== "vin") {
            vehicleDataPermissions.push(addVehiclePermission('OnVehicleData', addVehicleArray[i], functionalGroupName));
            vehicleDataPermissions.push(addVehiclePermission('GetVehicleData', addVehicleArray[i], functionalGroupName));
            vehicleDataPermissions.push(addVehiclePermission('SubscribeVehicleData', addVehicleArray[i], functionalGroupName));
            vehicleDataPermissions.push(addVehiclePermission('UnsubscribeVehicleData', addVehicleArray[i], functionalGroupName));
        }
        else {
            //vin only makes sense to be associated with a "GetVehicleData" RPC
            vehicleDataPermissions.push(addVehiclePermission('GetVehicleData', addVehicleArray[i], functionalGroupName));
        }

    }
    return [rpcPermissions, vehicleDataPermissions];
}

function addRpcPermission (rpcName, functionalGroupName) {
    return {
        functionalGroupName: functionalGroupName,
        rpcName: rpcName
    };
}

function addVehiclePermission (rpcName, vehicleName, functionalGroupName) {
    return {
        functionalGroupName: functionalGroupName,
        rpcName: rpcName,
        vehicleName: vehicleName
    };
}

// RPC PERMISSION AND VEHICLE PERMISSION GETTER FUNCTIONS

function base4 () {
    const addRpcArray = [
        "AddCommand",
        "AddSubMenu",
        "Alert",
        "ChangeRegistration",
        "CreateInteractionChoiceSet",
        "DeleteCommand",
        "DeleteFile",
        "DeleteInteractionChoiceSet",
        "DeleteSubMenu",
        "EncodedSyncPData",
        "EndAudioPassThru",
        "GenericResponse",
        "ListFiles",
        "OnAppInterfaceUnregistered",
        "OnAudioPassThru",
        "OnButtonEvent",
        "OnButtonPress",
        "OnCommand",
        "OnDriverDistraction",
        "OnEncodedSyncPData",
        "OnHashChange",
        "OnHMIStatus",
        "OnLanguageChange",
        "OnPermissionsChange",
        "OnSystemRequest",
        "PerformAudioPassThru",
        "PerformInteraction",
        "PutFile",
        "RegisterAppInterface",
        "ResetGlobalProperties",
        "ScrollableMessage",
        "SetAppIcon",
        "SetDisplayLayout",
        "SetGlobalProperties",
        "SetMediaClockTimer",
        "Show",
        "Slider",
        "Speak",
        "SubscribeButton",
        "SystemRequest",
        "UnregisterAppInterface",
        "UnsubscribeButton"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}

function location1 () {
    const addRpcArray = [];
    const addVehicleArray = [
        "gps",
        "speed"
    ];
    return [addRpcArray, addVehicleArray];
}

function notifications () {
    const addRpcArray = [
        "Alert"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}

function drivingCharacteristics3 () {
    const addRpcArray = [];
    const addVehicleArray = [
        "accPedalPosition",
        "beltStatus",
        "driverBraking",
        "myKey",
        "prndl",
        "rpm",
        "steeringWheelAngle"
    ];
    return [addRpcArray, addVehicleArray];
}

function vehicleInfo3 () {
    const addRpcArray = [];
    const addVehicleArray = [
        "bodyInformation",
        "deviceStatus",
        "engineTorque",
        "externalTemperature",
        "fuelLevel",
        "fuelLevel_State",
        "headLampStatus",
        "instantFuelConsumption",
        "odometer",
        "tirePressure",
        "vin",
        "wiperStatus"
    ];
    return [addRpcArray, addVehicleArray];
}

function propriataryData1 () {
    const addRpcArray = [
        "DiagnosticMessage",
        "GetDTCs",
        "ReadDID"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}

function propriataryData2 () {
    const addRpcArray = [
        "DiagnosticMessage",
        "GetDTCs",
        "ReadDID"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}

function proprietaryData3 () {
    const addRpcArray = [
        "GetDTCs",
        "ReadDID"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}

function emergency1 () {
    const addRpcArray = [];
    const addVehicleArray = [
        "airbagStatus",
        "clusterModeStatus",
        "eCallInfo",
        "emergencyEvent"
    ];
    return [addRpcArray, addVehicleArray];
}

function navigation1 () {
    const addRpcArray = [
        "AlertManeuver",
        "ShowConstantTBT",
        "UpdateTurnList"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}

function base6 () {
    const addRpcArray = [
        "AddCommand",
        "AddSubMenu",
        "Alert",
        "ChangeRegistration",
        "CreateInteractionChoiceSet",
        "DeleteCommand",
        "DeleteFile",
        "DeleteInteractionChoiceSet",
        "DeleteSubMenu",
        "EncodedSyncPData",
        "EndAudioPassThru",
        "GenericResponse",
        "ListFiles",
        "OnAppInterfaceUnregistered",
        "OnAudioPassThru",
        "OnButtonEvent",
        "OnButtonPress",
        "OnCommand",
        "OnDriverDistraction",
        "OnEncodedSyncPData",
        "OnHMIStatus",
        "OnLanguageChange",
        "OnPermissionsChange",
        "OnSyncPData",
        "OnTBTClientState",
        "PerformAudioPassThru",
        "PerformInteraction",
        "PutFile",
        "RegisterAppInterface",
        "ResetGlobalProperties",
        "ScrollableMessage",
        "SetAppIcon",
        "SetDisplayLayout",
        "SetGlobalProperties",
        "SetMediaClockTimer",
        "Show",
        "Slider",
        "Speak",
        "SubscribeButton",
        "SyncPData",
        "UnregisterAppInterface",
        "UnsubscribeButton"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}

function onKeyboardInputOnlyGroup () {
    const addRpcArray = [
        "OnKeyboardInput"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}

function onTouchEventOnlyGroup () {
    const addRpcArray = [
        "OnTouchEvent"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}

function diagnosticMessageOnly () {
    const addRpcArray = [
        "DiagnosticMessage"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}

function baseBeforeDataConsent () {
    const addRpcArray = [
        "ChangeRegistration",
        "DeleteFile",
        "EncodedSyncPData",
        "ListFiles",
        "OnAppInterfaceUnregistered",
        "OnEncodedSyncPData",
        "OnHashChange",
        "OnHMIStatus",
        "OnLanguageChange",
        "OnPermissionsChange",
        "OnSystemRequest",
        "PutFile",
        "RegisterAppInterface",
        "ResetGlobalProperties",
        "SetGlobalProperties",
        "SetAppIcon",
        "SetDisplayLayout",
        "SystemRequest",
        "UnregisterAppInterface"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}

function sendLocation () {
    const addRpcArray = [
        "SendLocation"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}

function wayPoints () {
    const addRpcArray = [
        "GetWayPoints",
        "SubscribeWayPoints",
        "UnsubscribeWayPoints"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}

function backgroundApt () {
    const addRpcArray = [
        "EndAudioPassThru",
        "OnAudioPassThru",
        "PerformAudioPassThru"
    ];
    const addVehicleArray = [];
    return [addRpcArray, addVehicleArray];
}