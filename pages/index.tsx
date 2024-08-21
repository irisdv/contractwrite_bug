// import styles from "@/styles/Home.module.css";
import { useEffect, useMemo, useState } from "react";
import { useAccount, useConnect, useContractWrite } from "@starknet-react/core";
import { useRouter } from "next/router";
import { hexToDecimal } from "@/utils/utils";
import WalletConnect from "@/component/walletConnect";
import { Connector } from "starknetkit";

export default function Home() {
  const { address } = useAccount();
  console.log("address", address);
  const [loading, setLoading] = useState<boolean>(true);
  const [ownedIdentities, setOwnedIdentities] = useState<any[]>([]);
  const [externalDomains, setExternalDomains] = useState<string[]>([]);
  const randomTokenId: number = Math.floor(Math.random() * 1000000000000);
  const router = useRouter();
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const { connectAsync, connectors } = useConnect();
  const [showWalletConnectModal, setShowWalletConnectModal] =
    useState<boolean>(false);

  //Mint
  const callData = useMemo(() => {
    return {
      contractAddress: process.env.NEXT_PUBLIC_IDENTITY_CONTRACT as string,
      entrypoint: "mint",
      calldata: [randomTokenId],
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // We want this to run only once
  const { writeAsync: execute, data: mintData } = useContractWrite({
    calls: [callData],
  });

  useEffect(() => {
    if (address) {
      setLoading(true);
      // Our Indexer
      fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_LINK
        }/addr_to_full_ids?addr=${hexToDecimal(address)}`
      )
        .then((response) => response.json())
        .then((data) => {
          setOwnedIdentities(data.full_ids);
          setLoading(false);
        });

      fetch(
        `${
          process.env.NEXT_PUBLIC_SERVER_LINK
        }/addr_to_external_domains?addr=${hexToDecimal(address)}`
      )
        .then((response) => response.json())
        .then((data: any) => {
          setExternalDomains(data.domains);
        });
    } else {
      setLoading(false);
    }
  }, [address, router.asPath]);

  function mint() {
    execute();
  }

  const connectWallet = async (connector: Connector) => {
    await connectAsync({ connector });
    localStorage.setItem("SID-connectedWallet", connector.id);
    localStorage.setItem("SID-lastUsedConnector", connector.id);
  };

  return (
    <>
      {/* <div className={styles.containerGallery}> */}
      <div>
        <div>
          {loading ? (
            <div>Loading</div>
          ) : ownedIdentities.length + externalDomains.length === 0 ||
            !address ? (
            <>
              <h1 className="title text-center mb-[16px]">
                All Your Identities in One Place
              </h1>
              <p className="description text-center max-w-2xl">
                Easily access and manage all your identities from one
                centralized location. Streamline your digital presence with
                convenience and control.
              </p>
              <div className="w-fit block mx-auto px-4 mt-[33px]">
                <button
                  onClick={
                    address
                      ? () => mint()
                      : () => setShowWalletConnectModal(true)
                  }
                >
                  {address ? "Connect" : "Add Identities"}
                </button>
              </div>
            </>
          ) : (
            <div>
              {/* <IdentitiesGallery
                identities={ownedIdentities}
                externalDomains={externalDomains}
                address={address}
              /> */}
              <div className="w-fit block mx-auto px-4 mt-[33px]">
                <button
                  onClick={
                    address
                      ? () => mint()
                      : () => setShowWalletConnectModal(true)
                  }
                >
                  {address ? "Connect" : "Add Identities"}
                </button>
                {/* <ClickableAction
                  title="ADD IDENTITIES"
                  icon={<MintIcon />}
                  onClick={
                    address
                      ? () => mint()
                      : () => setShowWalletConnectModal(true)
                  }
                  width="auto"
                /> */}
              </div>
            </div>
          )}
        </div>
      </div>
      <WalletConnect
        closeModal={() => setShowWalletConnectModal(false)}
        open={showWalletConnectModal}
        connectors={connectors as Connector[]}
        connectWallet={connectWallet}
      />
    </>
  );
}
