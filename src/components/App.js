import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { HashRouter, Routes, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import { ethers } from 'ethers'

// components
import Navigation from './Navigation'
import ViewTranscripts from './ViewTranscripts'
import ViewDiplomas from './ViewDiplomas'
import IssueTranscripts from './IssueTranscripts'
import IssueDiplomas from './IssueDiplomas'
import Tabs from './Tabs'

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadCredentials,
  loadAcademicCreds,
  loadIsSchool
} from '../store/interactions'

function App() {

  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    let account, academicCreds

    // initiate provider
    const provider = await loadProvider(dispatch)

    // fetch chainId
    const chainId = await loadNetwork(provider, dispatch)

    // reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    // fetch current account from Metamask when changed
    window.ethereum.on('accountsChanged', async () => {
      account = await loadAccount(dispatch)
    })

    // initiate contracts
    await loadCredentials(provider, chainId, dispatch)
    academicCreds = await loadAcademicCreds(provider, chainId, dispatch)

    // set the isSchool indicator for the current account
    await loadIsSchool(academicCreds, account, dispatch)
  }

  useEffect(() => {
    loadBlockchainData()
  }, []);

  return (
    <Container>
      <HashRouter>

        <Navigation />

        <hr />

        <Routes>
          <Route exact path="/" element={<ViewTranscripts />} />
          <Route path="/view-diplomas" element={<ViewDiplomas />} />
          <Route path="/issue-transcripts" element={<IssueTranscripts />} />
          <Route path="/issue-diplomas" element={<IssueDiplomas />} />
        </Routes>

      </HashRouter>
    </Container>
  )
}

export default App;
