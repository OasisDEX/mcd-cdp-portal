export async function getTestchainDetails(testchainId) {
  try {
    const rawRes = await fetch(
      `http://18.185.172.121:4000/chain/${testchainId}`
    );
    const { details } = await rawRes.json();
    const addresses = details.deploy_data;
    const rpcURL = details.chain_details.rpc_url;
    return { rpcURL, addresses, notFound: false };
  } catch (_) {
    return { rpcURL: '', addresses: {}, notFound: true };
  }
}
