namespace cadastro_livro
{
    partial class Form6
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.textUser = new System.Windows.Forms.TextBox();
            this.textPass = new System.Windows.Forms.TextBox();
            this.buton_login = new System.Windows.Forms.Button();
            this.textBox1 = new System.Windows.Forms.TextBox();
            this.linkLabel1 = new System.Windows.Forms.LinkLabel();
            this.SuspendLayout();
            // 
            // textUser
            // 
            this.textUser.Location = new System.Drawing.Point(167, 160);
            this.textUser.Name = "textUser";
            this.textUser.PlaceholderText = "Username";
            this.textUser.Size = new System.Drawing.Size(190, 23);
            this.textUser.TabIndex = 3;
            // 
            // textPass
            // 
            this.textPass.Location = new System.Drawing.Point(167, 189);
            this.textPass.Name = "textPass";
            this.textPass.PlaceholderText = "Password";
            this.textPass.Size = new System.Drawing.Size(190, 23);
            this.textPass.TabIndex = 5;
            // 
            // buton_login
            // 
            this.buton_login.Location = new System.Drawing.Point(231, 266);
            this.buton_login.Name = "buton_login";
            this.buton_login.Size = new System.Drawing.Size(75, 23);
            this.buton_login.TabIndex = 6;
            this.buton_login.Text = "Entrar";
            this.buton_login.UseVisualStyleBackColor = true;
            this.buton_login.Click += new System.EventHandler(this.buton_login_Click);
            // 
            // textBox1
            // 
            this.textBox1.Location = new System.Drawing.Point(167, 316);
            this.textBox1.Multiline = true;
            this.textBox1.Name = "textBox1";
            this.textBox1.Size = new System.Drawing.Size(190, 59);
            this.textBox1.TabIndex = 7;
            // 
            // linkLabel1
            // 
            this.linkLabel1.AutoSize = true;
            this.linkLabel1.Location = new System.Drawing.Point(167, 230);
            this.linkLabel1.Name = "linkLabel1";
            this.linkLabel1.Size = new System.Drawing.Size(95, 15);
            this.linkLabel1.TabIndex = 8;
            this.linkLabel1.TabStop = true;
            this.linkLabel1.Text = "Recuperar Senha";
            // 
            // Form6
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(542, 450);
            this.Controls.Add(this.linkLabel1);
            this.Controls.Add(this.textBox1);
            this.Controls.Add(this.buton_login);
            this.Controls.Add(this.textPass);
            this.Controls.Add(this.textUser);
            this.Name = "Form6";
            this.Text = "Form6";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private TextBox textUser;
        private TextBox textPass;
        private Button buton_login;
        private TextBox textBox1;
        private LinkLabel linkLabel1;
    }
}