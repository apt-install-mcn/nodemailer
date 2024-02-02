const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');


const {EMAIL, PASSWORD} = require('../env.js');
/*send mail from testing account*/
const signup = async (req, res) => {
    const { name, tipoDocumento, documentNumber, representative, birthplace, diagnosis, YesNo, birthdate, email, phone } = req.body;

    // Crear un objeto Mailgen
    const mailGenerator = new Mailgen({
        theme: 'default',
        product: {
            name: 'Funcoadee',
            link: 'https://mailgen.js/'
        }
    });

    // Configurar el contenido del correo
    const emailContent = {
        body: {
            name: name,
            intro: 'Tu información ha sido recibida con éxito',
            table: {
                data: [
                    {
                        descripción: `<strong>Nombre:</strong> ${name}<br>
                                      <strong>Tipo de documento:</strong> ${tipoDocumento}<br>
                                      <strong>Número de documento:</strong> ${documentNumber}<br>
                                      <strong>Representante:</strong> ${representative}<br>
                                      <strong>Lugar de nacimiento:</strong> ${birthplace}<br>
                                      <strong>Diagnóstico:</strong> ${diagnosis}<br>
                                      <strong>¿Cuenta con prueba?:</strong> ${YesNo}<br>
                                      <strong>Fecha de nacimiento:</strong> ${birthdate}<br>
                                      <strong>Correo electrónico:</strong> ${email}<br>
                                      <strong>Teléfono:</strong> ${phone}`,
                    }
                ]
            },
            outro: 'Nos comunicaremos pronto'
        }
    };

    // Generar el correo electrónico
    const emailBody = mailGenerator.generate(emailContent);

    // Configurar el transporte de nodemailer
    let transporter = nodemailer.createTransport({
        host: 'smtp.hostinger.com',
        port: 465,
        secure: true,
        auth: {
            user: EMAIL,
            pass: PASSWORD
        },
    });

    // Configurar las opciones del correo
    const mailOptions = {
        from: 'contacto@funcoadee.org',
        to: `${email}`,
        cc: 'contacto@funcoadee.org',
        subject: 'Nuevo mensaje de Funcoadee',
        html: emailBody
    };

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions)
        .then((info) => {
            return res.status(201).json({
                msg: '¡Mensaje enviado con éxito!',
                info: info.messageId,
                preview: nodemailer.getTestMessageUrl(info)
            });
        })
        .catch(error => {
            return res.status(500).json({ error });
        });
};

/*send mail from real gmail account */
const getbill = (req, res) => {
    try {
        console.log('Entrando en la función getbill');  // Agrega este log

        const { name, documentType, documentNumber, representative, birthplace, diagnosis, hasTest, birthdate, email, phone } = req.body;

        let config = {
            service: 'gmail',
            auth: {
                user: EMAIL,
                pass: PASSWORD
            },
            port: 465,
            secure: true
        }
        
        let transporter = nodemailer.createTransport(config);

        let MailGenerator = new Mailgen({
            theme: "default",
            product: {
                name: "Funcoadee",
                link: 'https://mailgen.js/'
            }
        })

        let response = {
            body: {
                name: name,
                intro: "Tu información ha sido recibida con éxito",
                table: {
                    data: [
                        {
                            // item: "Nodemailer Stack Book",
                            description: `Nombre: ${name}, Tipo de documento: ${documentType}, Número de documento: ${documentNumber}, Representante: ${representative}, Lugar de nacimiento: ${birthplace}, Diagnóstico: ${diagnosis}, ¿Cuenta con prueba?: ${hasTest}, Fecha de nacimiento: ${birthdate}, Correo electrónico: ${email}, Teléfono: ${phone}`,
                            price: "10.99",
                        }
                    ]
                },
                outro: "Nos comunicaremos"
            }
        }

        let mail = MailGenerator.generate(response)

        console.log('Después de procesar los datos');  // Agrega este log

        let message = {
            from: EMAIL,
            to: email,
            subject: "Realizar Pedido",
            html: mail
        }

        transporter.sendMail(message).then(() => {
            return res.status(201).json({
                msg: "¡Mensaje enviado con exito!"
            })
        }).catch(error => {
            console.error('Error en la función getbill:', error);  // Agrega este log

            return res.status(500).json({ error })
        })
    } catch (error) {
        return res.status(500).json({ error });
    }
}

module.exports = {
    signup,
    getbill
}
