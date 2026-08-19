namespace cadastro_livro
{
    partial class crud_cliente
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
            this.textApelidoCliente = new System.Windows.Forms.TextBox();
            this.label5 = new System.Windows.Forms.Label();
            this.buttonReset = new System.Windows.Forms.Button();
            this.textNomeCliente = new System.Windows.Forms.TextBox();
            this.label1 = new System.Windows.Forms.Label();
            this.buttonRegCli = new System.Windows.Forms.Button();
            this.textCelCli = new System.Windows.Forms.TextBox();
            this.label2 = new System.Windows.Forms.Label();
            this.textDivCli = new System.Windows.Forms.TextBox();
            this.label3 = new System.Windows.Forms.Label();
            this.cliente_inativo = new System.Windows.Forms.CheckBox();
            this.listViewCli = new System.Windows.Forms.ListView();
            this.id = new System.Windows.Forms.ColumnHeader();
            this.col_name = new System.Windows.Forms.ColumnHeader();
            this.col_apelido = new System.Windows.Forms.ColumnHeader();
            this.col_divida = new System.Windows.Forms.ColumnHeader();
            this.col_cel = new System.Windows.Forms.ColumnHeader();
            this.textNomeCli = new System.Windows.Forms.TextBox();
            this.btnBuscaCli = new System.Windows.Forms.Button();
            this.buttonDelCli = new System.Windows.Forms.Button();
            this.comboStatusCli = new System.Windows.Forms.ComboBox();
            this.label7 = new System.Windows.Forms.Label();
            this.textIdCli = new System.Windows.Forms.TextBox();
            this.label4 = new System.Windows.Forms.Label();
            this.SuspendLayout();
            // 
            // textApelidoCliente
            // 
            this.textApelidoCliente.Location = new System.Drawing.Point(12, 100);
            this.textApelidoCliente.Name = "textApelidoCliente";
            this.textApelidoCliente.PlaceholderText = "Apelido do Cliente";
            this.textApelidoCliente.Size = new System.Drawing.Size(256, 23);
            this.textApelidoCliente.TabIndex = 53;
            // 
            // label5
            // 
            this.label5.AutoSize = true;
            this.label5.Location = new System.Drawing.Point(12, 82);
            this.label5.Name = "label5";
            this.label5.Size = new System.Drawing.Size(105, 15);
            this.label5.TabIndex = 52;
            this.label5.Text = "Apelido do Cliente";
            // 
            // buttonReset
            // 
            this.buttonReset.Enabled = false;
            this.buttonReset.Location = new System.Drawing.Point(12, 302);
            this.buttonReset.Name = "buttonReset";
            this.buttonReset.Size = new System.Drawing.Size(256, 23);
            this.buttonReset.TabIndex = 51;
            this.buttonReset.Text = "Limpar";
            this.buttonReset.UseVisualStyleBackColor = true;
            this.buttonReset.Click += new System.EventHandler(this.buttonReset_Click);
            // 
            // textNomeCliente
            // 
            this.textNomeCliente.Location = new System.Drawing.Point(12, 50);
            this.textNomeCliente.Name = "textNomeCliente";
            this.textNomeCliente.PlaceholderText = "Nome Cliente";
            this.textNomeCliente.Size = new System.Drawing.Size(256, 23);
            this.textNomeCliente.TabIndex = 50;
            // 
            // label1
            // 
            this.label1.AutoSize = true;
            this.label1.Location = new System.Drawing.Point(12, 32);
            this.label1.Name = "label1";
            this.label1.Size = new System.Drawing.Size(97, 15);
            this.label1.TabIndex = 49;
            this.label1.Text = "Nome do Cliente";
            // 
            // buttonRegCli
            // 
            this.buttonRegCli.Location = new System.Drawing.Point(12, 244);
            this.buttonRegCli.Name = "buttonRegCli";
            this.buttonRegCli.Size = new System.Drawing.Size(256, 23);
            this.buttonRegCli.TabIndex = 48;
            this.buttonRegCli.Text = "Salvar";
            this.buttonRegCli.UseVisualStyleBackColor = true;
            this.buttonRegCli.Click += new System.EventHandler(this.buttonRegCli_Click);
            // 
            // textCelCli
            // 
            this.textCelCli.Location = new System.Drawing.Point(12, 148);
            this.textCelCli.Name = "textCelCli";
            this.textCelCli.PlaceholderText = "99 999999999";
            this.textCelCli.Size = new System.Drawing.Size(256, 23);
            this.textCelCli.TabIndex = 56;
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Location = new System.Drawing.Point(12, 130);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(101, 15);
            this.label2.TabIndex = 55;
            this.label2.Text = "Celular do Cliente";
            // 
            // textDivCli
            // 
            this.textDivCli.Location = new System.Drawing.Point(12, 196);
            this.textDivCli.Name = "textDivCli";
            this.textDivCli.PlaceholderText = "R$ 0.00";
            this.textDivCli.Size = new System.Drawing.Size(142, 23);
            this.textDivCli.TabIndex = 58;
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Location = new System.Drawing.Point(12, 178);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(97, 15);
            this.label3.TabIndex = 57;
            this.label3.Text = "Divida do Cliente";
            // 
            // cliente_inativo
            // 
            this.cliente_inativo.AutoSize = true;
            this.cliente_inativo.Location = new System.Drawing.Point(304, 23);
            this.cliente_inativo.Name = "cliente_inativo";
            this.cliente_inativo.Size = new System.Drawing.Size(89, 19);
            this.cliente_inativo.TabIndex = 62;
            this.cliente_inativo.Text = "Desativados";
            this.cliente_inativo.UseVisualStyleBackColor = true;
            this.cliente_inativo.CheckedChanged += new System.EventHandler(this.clientes_desativados_CheckedChanged);
            // 
            // listViewCli
            // 
            this.listViewCli.Columns.AddRange(new System.Windows.Forms.ColumnHeader[] {
            this.id,
            this.col_name,
            this.col_apelido,
            this.col_divida,
            this.col_cel});
            this.listViewCli.FullRowSelect = true;
            this.listViewCli.Location = new System.Drawing.Point(304, 73);
            this.listViewCli.Name = "listViewCli";
            this.listViewCli.Size = new System.Drawing.Size(285, 252);
            this.listViewCli.TabIndex = 61;
            this.listViewCli.UseCompatibleStateImageBehavior = false;
            this.listViewCli.View = System.Windows.Forms.View.Details;
            this.listViewCli.SelectedIndexChanged += new System.EventHandler(this.listViewCli_click);
            // 
            // id
            // 
            this.id.Text = "id";
            this.id.Width = 0;
            // 
            // col_name
            // 
            this.col_name.Text = "Nome";
            this.col_name.Width = 80;
            // 
            // col_apelido
            // 
            this.col_apelido.Text = "Apelido";
            this.col_apelido.Width = 70;
            // 
            // col_divida
            // 
            this.col_divida.Text = "Divida";
            // 
            // col_cel
            // 
            this.col_cel.Text = "Celular";
            this.col_cel.Width = 80;
            // 
            // textNomeCli
            // 
            this.textNomeCli.Location = new System.Drawing.Point(304, 45);
            this.textNomeCli.Name = "textNomeCli";
            this.textNomeCli.PlaceholderText = "Nome do Cliente";
            this.textNomeCli.Size = new System.Drawing.Size(191, 23);
            this.textNomeCli.TabIndex = 60;
            // 
            // btnBuscaCli
            // 
            this.btnBuscaCli.Location = new System.Drawing.Point(501, 45);
            this.btnBuscaCli.Name = "btnBuscaCli";
            this.btnBuscaCli.Size = new System.Drawing.Size(88, 23);
            this.btnBuscaCli.TabIndex = 59;
            this.btnBuscaCli.Text = "Buscar Cliente";
            this.btnBuscaCli.UseVisualStyleBackColor = true;
            this.btnBuscaCli.Click += new System.EventHandler(this.btnBuscaCli_Click);
            // 
            // buttonDelCli
            // 
            this.buttonDelCli.Location = new System.Drawing.Point(12, 273);
            this.buttonDelCli.Name = "buttonDelCli";
            this.buttonDelCli.Size = new System.Drawing.Size(256, 23);
            this.buttonDelCli.TabIndex = 63;
            this.buttonDelCli.Text = "Desativar";
            this.buttonDelCli.UseVisualStyleBackColor = true;
            this.buttonDelCli.Click += new System.EventHandler(this.buttonDelCli_Click);
            // 
            // comboStatusCli
            // 
            this.comboStatusCli.Enabled = false;
            this.comboStatusCli.FormattingEnabled = true;
            this.comboStatusCli.Items.AddRange(new object[] {
            "Ativo",
            "Inativo"});
            this.comboStatusCli.Location = new System.Drawing.Point(169, 196);
            this.comboStatusCli.Name = "comboStatusCli";
            this.comboStatusCli.Size = new System.Drawing.Size(99, 23);
            this.comboStatusCli.TabIndex = 65;
            this.comboStatusCli.Text = "Select";
            this.comboStatusCli.SelectedIndexChanged += new System.EventHandler(this.comboStatusCli_SelectedIndexChanged);
            // 
            // label7
            // 
            this.label7.AutoSize = true;
            this.label7.Location = new System.Drawing.Point(169, 178);
            this.label7.Name = "label7";
            this.label7.Size = new System.Drawing.Size(39, 15);
            this.label7.TabIndex = 64;
            this.label7.Text = "Status";
            // 
            // textIdCli
            // 
            this.textIdCli.Enabled = false;
            this.textIdCli.Location = new System.Drawing.Point(192, 21);
            this.textIdCli.Name = "textIdCli";
            this.textIdCli.PlaceholderText = "Id Cliente";
            this.textIdCli.Size = new System.Drawing.Size(76, 23);
            this.textIdCli.TabIndex = 66;
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Location = new System.Drawing.Point(169, 24);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(17, 15);
            this.label4.TabIndex = 67;
            this.label4.Text = "Id";
            // 
            // Form5
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 15F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(601, 337);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.textIdCli);
            this.Controls.Add(this.comboStatusCli);
            this.Controls.Add(this.label7);
            this.Controls.Add(this.buttonDelCli);
            this.Controls.Add(this.cliente_inativo);
            this.Controls.Add(this.listViewCli);
            this.Controls.Add(this.textNomeCli);
            this.Controls.Add(this.btnBuscaCli);
            this.Controls.Add(this.textDivCli);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.textCelCli);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.textApelidoCliente);
            this.Controls.Add(this.label5);
            this.Controls.Add(this.buttonReset);
            this.Controls.Add(this.textNomeCliente);
            this.Controls.Add(this.label1);
            this.Controls.Add(this.buttonRegCli);
            this.Name = "Form5";
            this.Text = "Form5";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private TextBox textApelidoCliente;
        private Label label5;
        private Button buttonReset;
        private TextBox textNomeCliente;
        private Label label1;
        private Button buttonRegCli;
        private TextBox textCelCli;
        private Label label2;
        private TextBox textDivCli;
        private Label label3;
        private CheckBox cliente_inativo;
        private ListView listViewCli;
        private ColumnHeader id;
        private ColumnHeader col_name;
        private ColumnHeader col_apelido;
        private ColumnHeader col_divida;
        private TextBox textNomeCli;
        private Button btnBuscaCli;
        private Button buttonDelCli;
        private ColumnHeader col_cel;
        private ComboBox comboStatusCli;
        private Label label7;
        private TextBox textIdCli;
        private Label label4;
    }
}