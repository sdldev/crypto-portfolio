import styles from '@styles/Services.module.scss'
import projects from 'data/projects'
import { useContext, useEffect, useRef, useState } from 'react'
import Head from 'next/head'
import { Context } from '@context/context'
import { fetchNetInfo, fetchSnap, fetchStatus } from 'utils/fetchProject.js'
import CodeSnippet from './UI/CodeSnippet'
import { Alert } from 'antd'
import AnimatedSection from './AnimatedSection'

const Upgrade = props => {
	const name = props.name
	const type = props.type
	const project = projects[type][name]
	const explorer = useRef()
	const projectName = project?.name || name.charAt(0).toUpperCase() + name.slice(1)
	const bin = project.bin
	const port = project.port
	const path = project.path
	const installBin = project.newInstallBin
	const isEmpty = installBin === undefined ? true : false
	let indexOfMv, mvLine, newPath, beforeMv
	if (!isEmpty) {
		indexOfMv = installBin
			.split('\n')
			.findIndex(line => line.trim().startsWith('mv') || line.trim().startsWith('sudo mv'))
		mvLine = installBin.split('\n').find(line => line.trim().startsWith('sudo mv'))

		newPath = indexOfMv !== -1 ? mvLine.split(' ')[2] : ''
		beforeMv = installBin.split('\n').slice(0, indexOfMv).join('\n')
		beforeMv = beforeMv.split('\n').join(' && \\\n')
		beforeMv = beforeMv + ' && \\\n'
	}

	const updHeight = project?.updHeight
	explorer.current = project.explorer
	const { theme } = useContext(Context)
	const [blockHeight, setBlockHeight] = useState(null)
	const [inputStatus, setInputStatus] = useState('')

	const status = () => {
		fetchStatus(name, type)
			.then(status => {
				setId(status.node_info.network)
				setBlockHeight(status.sync_info.latest_block_height)
			})
			.catch(err => {
				console.log(err)
			})
	}

	const netInfo = () => {
		fetchNetInfo(name, type)
			.then(info => {
				const peers = info.peers
				const livePeers = []
				const letters = /[a-zA-Z]/

				peers.map(peer => {
					if (peer.is_outbound === true) {
						let ip = peer.remote_ip
						const id = peer.node_info.id
						const listen_addr = peer.node_info.listen_addr

						if (letters.test(ip)) {
							ip = `[${ip}]`
						}

						let i = listen_addr.length - 1
						let port = ''

						while (listen_addr[i] !== ':') {
							port += listen_addr[i]
							i--
						}
						port = port.split('').reverse().join('')
						livePeers.push(`${id}@${ip}:${port}`)
					}
				})
				livePeers.unshift('')
				setLivePeersCounter(livePeers.length)
				setLivePeers(livePeers.join())
			})
			.catch(err => {
				console.log(err)
			})
	}

	const snap = () => {
		fetchSnap(name, type)
			.then(data => {
				setPruning(data.pruning)
				setIndexer(data.indexer)
			})
			.catch(err => {
				console.log(err)
			})
	}

	const fetchData = () => {
		status()
		netInfo()
		snap()
	}

	useEffect(() => {
		snap()
		fetchData()
		const intervalId = setInterval(fetchData, 10000)

		return () => {
			clearInterval(intervalId)
		}
	}, [])

	const handlePort = e => {
		let onlyNumbers = /^\d+$/
		if (onlyNumbers.test(e.target.value) || e.target.value === '') {
			setPort(e.target.value)
			setInputStatus('')
		} else {
			setInputStatus('error')
		}
	}

	return (
		<AnimatedSection>
			<Head>
				<title>{`Upgrade - ${projectName} | Services`}</title>
				<meta name='description' content='ITRocket 🚀 | Crypto Multipurpose Project' />
			</Head>
			<div
				className={styles.mainColumn}
				id='mainColumn'
				style={{ backgroundColor: theme === 'light' ? '#fff' : '#1b1b1b' }}
			>
				<></>
				{!updHeight ? (
					<p style={{ marginBlock: '8px' }}>Project has no upgrades yet</p>
				) : (
					<>
						{updHeight == 0 ? (
							''
						) : (
							<>
								<Alert
									message={`Upgrade height: ${updHeight}. Please don\`t upgrade before the specified height.`}
									type='info'
									showIcon
									closable
									style={{
										width: 'fit-content',
										marginTop: '10px',
										marginBottom: '-5px'
									}}
								/>
								<p className='flex items-center gap-2'>
									<span></span>
									{/* <span className='divider__dot' />
							<span> Avg</span> */}
								</p>
							</>
						)}
						<h2 id='manual'>Manual upgrade</h2>
						<p className={styles.text_secondary}></p>
						<CodeSnippet
							theme={theme}
							code={`${installBin}
sudo systemctl restart ${bin} && sudo journalctl -u ${bin} -f`}
						/>
						{updHeight == 0 || indexOfMv === -1 ? (
							''
						) : (
							<>
								<h2 id='auto'>Auto upgrade</h2>
								{/* <Space direction='vertical' className='my-2'>
									<span className={styles}>Port</span>
									<Input
										className={styles.input}
										status={inputStatus}
										defaultValue={port}
										maxLength={2}
										style={{ maxWidth: '45px' }}
										onChange={handlePort}
									/>
								</Space> */}
								<Alert
									message={
										<p>
											Don't kill the session with <kbd className={styles.kbd}>CTRL+C</kbd> before
											update is completed, if you want to disconnect the session use{' '}
											<kbd className={styles.kbd}>CTRL+B D</kbd>{' '}
										</p>
									}
									type='warning'
									showIcon
									closable
									style={{
										width: 'fit-content',
										marginBlock: '5px'
									}}
								/>
								<CodeSnippet
									theme={theme}
									code={`${beforeMv}old_bin_path=$(which ${bin}) && \\
home_path=$HOME && \\
rpc_port=$(grep -m 1 -oP '^laddr = "\\K[^"]+' "$HOME/${path}/config/config.toml" | cut -d ':' -f 3) && \\
tmux new -s ${name}-upgrade "sudo bash -c 'curl -s https://raw.githubusercontent.com/itrocket-team/testnet_guides/main/utils/autoupgrade/upgrade.sh | bash -s -- -u \\"${updHeight}\\" -b ${bin} -n \\"${newPath}\\" -o \\"$old_bin_path\\" -p ${name} -r \\"$rpc_port\\"'"`}
								/>
							</>
						)}
					</>
				)}
			</div>
		</AnimatedSection>
	)
}

export default Upgrade
