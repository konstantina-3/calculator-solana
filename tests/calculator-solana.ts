import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { CalculatorSolana } from "../target/types/calculator_solana";
const { SystemProgram } = anchor.web3
import { expect } from 'chai';

describe("calculator-solana", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.CalculatorSolana as Program<CalculatorSolana>;

  // Referencing the program - Abstraction that allows us to call methods of our SOL program.
  // const program = anchor.workspace.Calculator as Program<Calculator>;
  const programProvider = program.provider as anchor.AnchorProvider;

  // Generating a keypair for our Calculator account
  const calculatorPair = anchor.web3.Keypair.generate();

  const text = "Summer School Of Solana"

  //Creating a test block
  it("Creating Calculator Instance", async () => {
    //Calling create instance - Set our calculator keypair as a signer
    await program.methods.create(text).accounts(
      {
          calculator: calculatorPair.publicKey,
          user: programProvider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
      }
    ).signers([calculatorPair]).rpc()

    // We fetch the account and read if the string is actually in the account
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.greeting).to.eql(text)
  });

  // Another test step - test out addition
  it('Addition',async () => {
    await program.methods.add(new anchor.BN(2), new anchor.BN(3))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()
    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(5))
  })

  it('Subtraction',async () => {
    await program.methods.subtract(new anchor.BN(6), new anchor.BN(4))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()

    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(2))
  })

  it('Multiplication',async () => {
    await program.methods.multiply(new anchor.BN(4), new anchor.BN(3))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()

    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(12))
  })

  it('Division',async () => {
    await program.methods.divide(new anchor.BN(10), new anchor.BN(2))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()

    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(5))
  })

  it('Exponentiation',async () => {
    await program.methods.power(new anchor.BN(2), new anchor.BN(5))
    .accounts({
        calculator: calculatorPair.publicKey,
    })
    .rpc()

    const account = await program.account.calculator.fetch(calculatorPair.publicKey)
    expect(account.result).to.eql(new anchor.BN(32))
  })

});
