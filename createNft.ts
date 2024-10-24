import { createNft, fetchDigitalAsset, mplTokenMetadata } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { generateSigner, keypairIdentity, percentAmount, publicKey } from "@metaplex-foundation/umi";

const connection = new Connection("https://api.devnet.solana.com")
const user = await getKeypairFromFile()//keypair generation

await airdropIfRequired(
    connection,
    user.publicKey,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL
)



console.log("Loaded User ", user.publicKey.toBase58())

const umi = createUmi(connection.rpcEndpoint) //create instance
umi.use(mplTokenMetadata())

const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey)
umi.use(keypairIdentity(umiUser))

console.log("Set up UMI instance for user")

const collectionAddress = publicKey("H4HVvXAHvBXQA4gRo2Pw28KBNgPNPm3wDAkND7BZogvC");


console.log("NFT start creating...")

const mint = generateSigner(umi)

const transaction = await createNft(umi, {
    mint,
    name: "Nishant NFT 1",
    uri: "https://raw.githubusercontent.com/NishantCoder108/nft/refs/heads/main/nft1.json",
    sellerFeeBasisPoints: percentAmount(0),
    collection: {
        key: collectionAddress,
        verified: false,
    },
})


await transaction.sendAndConfirm(umi)

const createdNft = await fetchDigitalAsset(umi, mint.publicKey)

console.log(`Created NFT! Address is ${getExplorerLink("address", createdNft.mint.publicKey, "devnet")}`)


// Nft address : BLUmyk5RwHEehw3K1pdqAsTm7A2Q35CJTFqxMZ9E4uC6
// Mint authority | Freeze authority : FfNiAY2YtHV466HD3NQefj4AUnzMDhYkrwzyG4Y1FZ7F
// Update authority : C6dNCmKipcGKzZkiPV9zn19VuSBUgFL1j7qH1W8nXqKP