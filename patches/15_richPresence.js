const fetchApplicationsRPC = Vencord.Webpack.findByCodeLazy("APPLICATION_RPC(", "Client ID");

async function lookupAsset(applicationId, key) {
    return (await Vencord.Webpack.Common.ApplicationAssetUtils.fetchAssetIds(applicationId, [key]))[0];
}

const apps = {};
async function lookupApp(applicationId) {
    const socket = {};
    await fetchApplicationsRPC(socket, applicationId);
    return socket.application;
}

goofcord.rpcListen(async (data) => {
    data = JSON.parse(data);

    const { activity } = data;
    const assets = activity?.assets;

    if (assets?.large_image) assets.large_image = await lookupAsset(activity.application_id, assets.large_image);
    if (assets?.small_image) assets.small_image = await lookupAsset(activity.application_id, assets.small_image);

    if (activity) {
        const appId = activity.application_id;
        apps[appId] ||= await lookupApp(appId);

        const app = apps[appId];
        activity.name ||= app.name;
    }

    Vencord.Webpack.Common.FluxDispatcher.dispatch({type: "LOCAL_ACTIVITY_UPDATE", ...data});
});