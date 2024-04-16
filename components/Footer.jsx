import Image from 'next/image'
import { useContext } from 'react'

import { Context } from '@context/context'
import '@styles/Footer.module.scss'
import styles from '@styles/Footer.module.scss'

const Footer = props => {
	const { theme, toggleTheme } = useContext(Context)

	return (
		<footer
			className={styles.footer}
			style={{
				backgroundColor: theme === 'light' ? '#fff' : '#1a1a1a'
			}}
		>
			<div className={styles.container}>

				<div className={styles.copyright}>
					<span>
						Thans for {' '}
						<a href='https://itrocket.net/' target='_blank' rel='noopener noreferrer'>
						ITRocket
						</a>
						{' '} and {' '}
						 <a href='https://indatechno.com' target='_blank' rel='noopener noreferrer'>
						 indatechno
						</a>
					</span>
					<span className='text-slate-600'>© zkNodes Team. All rights reserved</span>
				</div>

				<div className='flex flex-col gap-2'>
					<div className='socials'>
						<a href='https://t.me/zkNodesLabs' target='_blank' rel='noopener noreferrer'>
							<Image src='/icons/tg.svg' alt='telegram' width={35} height={35} />
						</a>

						<a href='https://twitter.com/zkNodes_org' target='_blank' rel='noopener noreferrer'>
							<Image src='/icons/twitter.svg' alt='twitter' width={35} height={35} />
						</a>
						<a href='https://github.com/sdldev' target='_blank' rel='noopener noreferrer'>
							<Image
								src='/icons/github.svg'
								alt='github'
								width={35}
								height={35}
								style={{ display: theme === 'light' ? 'block' : 'none' }}
							/>
							<Image
								src='/icons/github-white.svg'
								alt='github'
								width={35}
								height={35}
								style={{ display: theme === 'dark' ? 'block' : 'none' }}
							/>
						</a>
					</div>
				</div>
			</div>
		</footer>
	)
}

export default Footer
