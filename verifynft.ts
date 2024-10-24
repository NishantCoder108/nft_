import { findMetadataPda, mplTokenMetadata, verifyCollection, verifyCollectionV1 } from "@metaplex-foundation/mpl-token-metadata";
import { airdropIfRequired, getExplorerLink, getKeypairFromFile } from "@solana-developers/helpers";
import { createUmi } from "@metaplex-foundation/umi-bundle-defaults";
import { Connection, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { keypairIdentity, publicKey } from "@metaplex-foundation/umi";


const connection = new Connection("https://api.devnet.solana.com", "confirmed")

const user = await getKeypairFromFile()

await airdropIfRequired(
    connection,
    user.publicKey,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL
)


console.log("User Public Address ", user.publicKey.toBase58())

const umi = createUmi(connection.rpcEndpoint)
umi.use(mplTokenMetadata())


const umiUser = umi.eddsa.createKeypairFromSecretKey(user.secretKey)
umi.use(keypairIdentity(umiUser))


console.log("Set up Umi instance for user")

// my collection address
const collectionAddress = publicKey("H4HVvXAHvBXQA4gRo2Pw28KBNgPNPm3wDAkND7BZogvC")

const nftAddress = publicKey("BLUmyk5RwHEehw3K1pdqAsTm7A2Q35CJTFqxMZ9E4uC6")

const transaction = await verifyCollectionV1(umi, {
    metadata: findMetadataPda(umi, { mint: nftAddress }),
    collectionMint: collectionAddress,
    authority: umi.identity
})


transaction.sendAndConfirm(umi)

console.log(`NFT ${nftAddress} verified as member of collection ${collectionAddress}! See Explorer at ${getExplorerLink("address", nftAddress, "devnet")}`)