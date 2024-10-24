import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { generateSigner, keypairIdentity, percentAmount } from "@metaplex-foundation/umi";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";


// Establish connection

const connection = new Connection("https://api.devnet.solana.com", "confirmed")

// Load User keypair
const user = await getKeypairFromFile();

console.log("Loaded User :", user)

// Airdrop sol
await airdropIfRequired(connection, user.publicKey, 1 * LAMPORTS_PER_SOL, 0.5 * LAMPORTS_PER_SOL)


// Setup UMI , or Initialize umi and setup user's  identity
const umi = createUmi(connection.rpcEndpoint)
umi.use(mplTokenMetadata())//we will talk with core functionality


const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey)
umi.use(keypairIdentity(umiUser))


console.log("Set up Umi instance for user")

// Generate Collection Mint
const collectionMint = generateSigner(umi)

console.log("collection Mint Generated ")

// Create collection NFT with metadata ,setting isCollection = true, it will visible after isCollection : true

const transaction = await createNft(umi, {
    mint: collectionMint,
    name: "Nishant | dev",
    symbol: "NISHANT",
    uri: "https://raw.githubusercontent.com/NishantCoder108/nft/refs/heads/main/nft-collections.json",
    sellerFeeBasisPoints: percentAmount(0),//set seller fee
    isCollection: true


})


// Send and confirm Transactions
await transaction.sendAndConfirm(umi)

// Fetch collection info that newly created

const createdCollectionNft = await fetchDigitalAsset(umi, collectionMint.publicKey)

// Log success
console.log(`Created Collection 📦! Address is ${getExplorerLink("address", createdCollectionNft.mint.publicKey, "devnet")}`)



/*

collection address : H4HVvXAHvBXQA4gRo2Pw28KBNgPNPm3wDAkND7BZogvC
Mint Authority | Freeze Authority: 7QHGrxjUpg5pzG7PbuthX4RYLSNcyLviErsBc4b1JPmK
update Authority : C6dNCmKipcGKzZkiPV9zn19VuSBUgFL1j7qH1W8nXqKP
*/